import time
import json
import requests
from typing import List, Dict, Any


class RAGGenerator:
    """
    Streaming RAG Generator using Ollama local chat API.
    - Fully offline
    - Source-grounded
    - Metrics enabled
    """

    def __init__(
        self,
        model_name: str = "llama3.1:8b",
        ollama_url: str = "http://127.0.0.1:11434/api/chat",
        timeout_s: int = 120,
    ):
        self.model_name = model_name
        self.ollama_url = ollama_url
        self.timeout_s = timeout_s

    def build_prompt(self, query: str, chunks: List[Dict[str, Any]]) -> str:
        """
        Build a grounded prompt using retrieved chunks.
        """
        context_blocks = []

        for i, c in enumerate(chunks, start=1):
            src = (
                f"{c.get('document_name','unknown')} | "
                f"{c.get('page_or_section','N/A')} | "
                f"vector_id={c.get('vector_id','?')}"
            )
            text = (c.get("chunk_text") or "").strip()
            context_blocks.append(f"[Source {i}]\n{src}\n{text}")

        context = "\n\n".join(context_blocks)

        return f"""
You are an offline AI assistant.
Answer ONLY using the provided sources.
If the answer is not present, say:
"I don't have enough information in the provided documents."

User Question:
{query}

Sources:
{context}

Instructions:
- Give a concise answer first.
- Then list citations as bullet points:
  (document_name, page/section, vector_id).
""".strip()

    def generate(
        self,
        query: str,
        chunks: List[Dict[str, Any]],
        temperature: float = 0.2,
        stream: bool = True,
    ) -> Dict[str, Any]:
        """
        Generate answer from Ollama with streaming + metrics.
        """
        t0 = time.perf_counter()
        prompt = self.build_prompt(query, chunks)
        t_prompt = time.perf_counter()

        payload = {
            "model": self.model_name,
            "messages": [
                {"role": "system", "content": "You are a helpful offline assistant."},
                {"role": "user", "content": prompt},
            ],
            "stream": stream,
            "options": {
                "temperature": temperature
            },
        }

        answer_parts = []
        t_call0 = time.perf_counter()

        resp = requests.post(
            self.ollama_url,
            json=payload,
            stream=stream,
            timeout=self.timeout_s,
        )
        resp.raise_for_status()

        # ---- STREAMING RESPONSE ----
        if stream:
            for line in resp.iter_lines(decode_unicode=True):
                if not line:
                    continue
                try:
                    data = json.loads(line)
                    if "message" in data and "content" in data["message"]:
                        chunk = data["message"]["content"]
                        answer_parts.append(chunk)
                        print(chunk, end="", flush=True)
                except json.JSONDecodeError:
                    continue
            print()
        else:
            data = resp.json()
            answer_parts.append(data["message"]["content"])

        t_call1 = time.perf_counter()
        answer = "".join(answer_parts).strip()

        # ---- METRICS ----
        metrics = {
            "prompt_build_ms": round((t_prompt - t0) * 1000, 2),
            "ollama_call_ms": round((t_call1 - t_call0) * 1000, 2),
            "total_latency_ms": round((t_call1 - t0) * 1000, 2),
            "n_chunks_used": len(chunks),
            "prompt_chars": len(prompt),
            "answer_chars": len(answer),
        }

        citations = [
            {
                "document_name": c.get("document_name"),
                "page_or_section": c.get("page_or_section"),
                "vector_id": c.get("vector_id"),
                "score": c.get("score"),
            }
            for c in chunks
        ]

        return {
            "answer": answer,
            "citations": citations,
            "metrics": metrics,
        }
