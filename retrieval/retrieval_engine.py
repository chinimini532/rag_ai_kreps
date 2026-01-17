# retrieval/retrieval_engine.py

from pathlib import Path
from typing import List, Dict

from indexing.embedding_service import EmbeddingService
from indexing.vector_indexer import VectorIndexer
from database.metadata_store import MetadataStore


class RetrievalEngine:
    """
    Handles query-time retrieval for RAG.
    """

    def __init__(self, index_dir: Path = Path("data/vector_index")):
        # Embedding model (query-time)
        self.embedder = EmbeddingService()

        # FAISS index (load existing index)
        self.indexer = VectorIndexer(index_dir=index_dir)
        self.indexer.load()   # 🔑 REQUIRED

        # Metadata store (MySQL)
        self.db = MetadataStore()

    def retrieve(self, query: str, top_k: int = 5) -> List[Dict]:
        """
        Retrieve top-k relevant document chunks for a user query.
        """
        # 1. Embed query
        query_embedding = self.embedder.embed_query(query)

        # 2. Search FAISS index
        scores, vector_ids = self.indexer.search(query_embedding, top_k)

        # Convert numpy types to Python ints
        vector_ids = [int(v) for v in vector_ids if v != -1]

        if not vector_ids:
            return []

        # 3. Fetch metadata from MySQL
        chunks = self.db.fetch_by_vector_ids(vector_ids)

        # 4. Attach similarity scores
        score_map = dict(zip(vector_ids, scores))

        for chunk in chunks:
            chunk["score"] = score_map.get(chunk["vector_id"])

        return chunks

    def close(self):
        self.db.close()
