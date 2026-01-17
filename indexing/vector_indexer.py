# indexing/vector_indexer.py

import faiss
import numpy as np
from pathlib import Path
from typing import List, Optional


class VectorIndexer:
    """
    FAISS-based vector similarity index (cosine similarity).
    Uses explicit vector IDs for metadata alignment.
    """

def __init__(self, index_dir=None, *args, **kwargs):
    from pathlib import Path

    if index_dir is None:
        index_dir = Path("data/vector_index")

    self.index_dir = Path(index_dir)
    self.index_dir.mkdir(parents=True, exist_ok=True)

    self.index_path = self.index_dir / "faiss.index"
    self.index = None

    if self.index_path.exists():
        self.load()




    def _create_index(self, dim: int):
        """
        Create FAISS index with explicit ID mapping.
        Assumes embeddings are L2-normalized.
        """
        base_index = faiss.IndexFlatIP(dim)
        self.index = faiss.IndexIDMap(base_index)

    def add(self, embeddings: np.ndarray, ids: Optional[List[int]] = None):
        if not isinstance(embeddings, np.ndarray):
            embeddings = np.array(embeddings)

        if self.index is None:
            self._create_index(embeddings.shape[1])

        if ids is not None:
            ids = np.array(ids, dtype=np.int64)
            self.index.add_with_ids(embeddings, ids)
            return ids.tolist()
        else:
            self.index.add(embeddings)
            return None

    def save(self):
        faiss.write_index(self.index, str(self.index_path))

    def load(self):
        if not self.index_path.exists():
            raise FileNotFoundError("FAISS index not found.")
        self.index = faiss.read_index(str(self.index_path))

    def search(self, query_embedding: np.ndarray, top_k: int = 5):
        if self.index is None:
            raise RuntimeError("Index not loaded.")

        if query_embedding.ndim == 1:
            query_embedding = query_embedding.reshape(1, -1)

        scores, ids = self.index.search(query_embedding, top_k)
        return scores[0], ids[0]
