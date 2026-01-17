# indexing/text_chunker.py

from typing import List, Dict
from indexing.document_loader import load_documents, DATA_DIR


def chunk_text(text: str, chunk_size: int = 500, overlap: int = 100) -> List[str]:
    """
    Split text into overlapping fixed-length chunks.
    - chunk_size: maximum characters per chunk
    - overlap: repeated characters between consecutive chunks
    """
    chunks = []
    start = 0
    n = len(text)

    while start < n:
        end = start + chunk_size
        chunk = text[start:end].strip()

        if chunk:
            chunks.append(chunk)

        start = end - overlap
        if start < 0:
            start = 0

    return chunks


def chunk_documents(documents: List[Dict], min_chunk_length: int = 100) -> List[Dict]:
    """
    Convert loaded documents into chunk objects.
    Each chunk keeps traceability fields needed later for metadata storage (FR-12).
    """
    all_chunks = []

    for doc in documents:
        pieces = chunk_text(doc["text"])

        for i, piece in enumerate(pieces):
            if len(piece) < min_chunk_length:
                continue

            all_chunks.append(
                {
                    "doc_id": doc["doc_id"],
                    "chunk_id": f"{doc['doc_id']}_{i}",
                    "text": piece,
                    "source": doc["source"],
                }
            )

    return all_chunks


if __name__ == "__main__":
    docs = load_documents(DATA_DIR)
    chunks = chunk_documents(docs)

    print(f"Total documents: {len(docs)}")
    print(f"Total chunks: {len(chunks)}")

    if chunks:
        print("\nSample chunk:\n")
        print(chunks[0]["text"][:500])

        lengths = [len(c["text"]) for c in chunks]
        print("\nChunk length stats:")
        print("Min length:", min(lengths))
        print("Max length:", max(lengths))
        print("Avg length:", sum(lengths) // len(lengths))
