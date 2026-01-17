# generation/test_rag_generator.py

from retrieval.retrieval_engine import RetrievalEngine
from generation.rag_generator import RAGGenerator

engine = RetrievalEngine()
gen = RAGGenerator()

query = "한국은 전력망 손실을 어떻게 줄였습니까?"
chunks = engine.retrieve(query, top_k=3)

print("\n--- ANSWER ---\n")
result = gen.generate(query, chunks)

print(result["answer"])
print("\n--- METRICS ---")
print(result["metrics"])
print("\n--- CITATIONS ---")
for c in result["citations"]:
    print(c)
