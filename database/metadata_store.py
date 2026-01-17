# database/metadata_store.py

import os
from dotenv import load_dotenv
import mysql.connector
from typing import Dict, List

load_dotenv()


class MetadataStore:
    """
    Stores and retrieves chunk metadata linked to vector IDs.
    """

    def __init__(self):
        self.conn = mysql.connector.connect(
            host=os.getenv("DB_HOST", "127.0.0.1"),
            port=int(os.getenv("DB_PORT", 3306)),
            user=os.getenv("DB_USER", "root"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME", "rag_metadata"),
        )
        self.cursor = self.conn.cursor(dictionary=True)

    def insert_chunk_metadata(self, metadata: Dict):
        query = """
        INSERT INTO document_chunks
        (chunk_id, vector_id, document_name, page_or_section, chunk_text)
        VALUES (%s, %s, %s, %s, %s)
        """
        values = (
            metadata["chunk_id"],
            metadata["vector_id"],
            metadata["document_name"],
            metadata.get("page_or_section"),
            metadata["chunk_text"],
        )
        self.cursor.execute(query, values)
        self.conn.commit()

    def fetch_by_vector_ids(self, vector_ids: List[int]):
        placeholders = ",".join(["%s"] * len(vector_ids))
        query = f"""
        SELECT * FROM document_chunks
        WHERE vector_id IN ({placeholders})
        """
        self.cursor.execute(query, vector_ids)
        return self.cursor.fetchall()

    def close(self):
        self.cursor.close()
        self.conn.close()
