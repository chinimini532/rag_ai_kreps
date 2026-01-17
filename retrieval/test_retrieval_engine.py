from retrieval.retrieval_engine import RetrievalEngine

engine = RetrievalEngine()

query = "power grid stability and transmission"
results = engine.retrieve(query, top_k=3)

print("\nRetrieved Chunks:\n")
for r in results:
    print("-" * 40)
    print("Document:", r["document_name"])
    print("Vector ID:", r["vector_id"])
    print("Score:", r["score"])
    print("Text snippet:", r["chunk_text"][:300])

engine.close()
