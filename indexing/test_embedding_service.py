from indexing.document_loader import load_documents, DATA_DIR
from indexing.text_chunker import chunk_documents
from indexing.embedding_service import EmbeddingService

docs = load_documents(DATA_DIR)
chunks = chunk_documents(docs)

embedder = EmbeddingService()
embeddings = embedder.embed_chunks(chunks[:5])

print("Embeddings shape:", embeddings.shape)
