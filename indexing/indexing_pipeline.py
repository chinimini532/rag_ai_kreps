# indexing/indexing_pipeline.py

from pathlib import Path

from indexing.document_loader import load_documents, DATA_DIR
from indexing.text_chunker import chunk_documents
from indexing.embedding_service import EmbeddingService
from indexing.vector_indexer import VectorIndexer
from database.metadata_store import MetadataStore


def run_indexing_pipeline():
    print("=== STARTING INDEXING PIPELINE ===")

    # 1. Load documents
    documents = load_documents(DATA_DIR)
    print(f"Loaded {len(documents)} documents")

    # 2. Chunk documents
    chunks = chunk_documents(documents)
    print(f"Generated {len(chunks)} chunks")

    # 3. Embed chunks
    embedder = EmbeddingService()
    embeddings = embedder.embed_chunks(chunks)
    print(f"Generated embeddings with shape {embeddings.shape}")

    # 4. Create FAISS index
    index_dir = Path("data/vector_index")
    indexer = VectorIndexer(index_dir=index_dir)

    vector_ids = list(range(len(chunks)))
    indexer.add(embeddings, ids=vector_ids)
    indexer.save()
    print("FAISS index saved")

    # 5. Store metadata in MySQL
    db = MetadataStore()

    inserted = 0
    for chunk, vid in zip(chunks, vector_ids):
        metadata = {
            "chunk_id": chunk["chunk_id"],
            "vector_id": vid,
            "document_name": chunk["doc_id"],
            "page_or_section": None,
            "chunk_text": chunk["text"],
        }
        db.insert_chunk_metadata(metadata)
        inserted += 1

    db.close()
    print(f"Inserted {inserted} metadata rows")

    print("=== INDEXING PIPELINE COMPLETED ===")


if __name__ == "__main__":
    run_indexing_pipeline()
