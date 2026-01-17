# indexing/embedding_service.py

from sentence_transformers import SentenceTransformer
import numpy as np


class EmbeddingService:
    """
    Vector Embedding Service
    Converts text chunks and queries into dense embeddings.
    """

    def __init__(self, model_name: str = "BAAI/bge-m3"):
        self.model = SentenceTransformer(
            model_name,
            trust_remote_code=True
        )

    def embed_chunks(self, chunks):
        """
        Generate embeddings for document chunks.
        chunks: List[dict] with key 'text'
        """
        texts = [c["text"] for c in chunks]

        embeddings = self.model.encode(
            texts,
            batch_size=16,
            show_progress_bar=True,
            normalize_embeddings=True
        )

        return np.array(embeddings)

    def embed_query(self, query: str):
        """
        Generate embedding for a user query.
        """
        embedding = self.model.encode(
            query,
            normalize_embeddings=True
        )

        return embedding
