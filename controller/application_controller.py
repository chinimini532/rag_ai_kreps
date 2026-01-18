# controller/application_controller.py

from typing import Dict, Any, List
from pathlib import Path
import time

from indexing.indexing_pipeline import run_indexing_pipeline
from retrieval.retrieval_engine import RetrievalEngine
from generation.rag_generator import RAGGenerator
from database.metadata_store import MetadataStore


class ApplicationController:
    """
    Central orchestrator for the RAG AI Assistant.
    All UI interactions go through this controller.
    """

    def __init__(self):
        self.retrieval_engine = RetrievalEngine()
        self.generator = RAGGenerator()
        self.db = MetadataStore()

    # --------------------------------------------------
    # 1. CHAT / QUERY FLOW (Homepage)
    # --------------------------------------------------
    def answer_query(self, query: str, top_k: int = 3) -> Dict[str, Any]:
        """
        Handle a user query end-to-end.
        """
        t0 = time.perf_counter()

        # Retrieve relevant chunks
        chunks = self.retrieval_engine.retrieve(query, top_k=top_k)

        # Generate answer
        result = self.generator.generate(query, chunks)

        t1 = time.perf_counter()

        result["metrics"]["controller_total_ms"] = round((t1 - t0) * 1000, 2)

        return result

    # --------------------------------------------------
    # 2. DOCUMENT INGESTION FLOW
    # --------------------------------------------------
    def ingest_documents(self) -> Dict[str, Any]:
        """
        Trigger indexing pipeline and return ingestion stats.
        """
        t0 = time.perf_counter()

        stats = run_indexing_pipeline()

        t1 = time.perf_counter()

        stats["total_ingestion_time_ms"] = round((t1 - t0) * 1000, 2)

        return stats

    # --------------------------------------------------
    # 3. DASHBOARD / ANALYTICS
    # --------------------------------------------------
    def get_system_stats(self) -> Dict[str, Any]:
        """
        Collect system-level metrics for dashboard.
        """
        cursor = self.db.cursor

        cursor.execute("SELECT COUNT(DISTINCT document_name) AS docs FROM document_chunks")
        docs = cursor.fetchone()["docs"]

        cursor.execute("SELECT COUNT(*) AS chunks FROM document_chunks")
        chunks = cursor.fetchone()["chunks"]

        cursor.execute("SELECT COUNT(DISTINCT vector_id) AS vectors FROM document_chunks")
        vectors = cursor.fetchone()["vectors"]

        return {
            "documents": docs,
            "chunks": chunks,
            "vectors": vectors,
        }

    def close(self):
        self.db.close()
