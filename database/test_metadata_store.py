from database.metadata_store import MetadataStore

db = MetadataStore()

test_row = {
    "chunk_id": "test_doc_0",
    "vector_id": 0,
    "document_name": "test_doc.pdf",
    "page_or_section": "Page 1",
    "chunk_text": "This is a test chunk."
}

db.insert_chunk_metadata(test_row)

rows = db.fetch_by_vector_ids([0])
print(rows)

db.close()
