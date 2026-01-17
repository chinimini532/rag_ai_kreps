# indexing/document_loader.py

from pathlib import Path
import fitz  # PyMuPDF

SUPPORTED_EXTENSIONS = {".pdf", ".txt", ".md"}

PROJECT_ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = PROJECT_ROOT / "data" / "raw_documents"


def load_documents(data_dir: Path = DATA_DIR):
    """
    Loads PDF/TXT/MD documents from the local repository.

    Returns a list of dicts:
      - doc_id: filename stem
      - text: extracted text
      - source: absolute path string
    """
    documents = []

    for file_path in data_dir.rglob("*"):
        if not file_path.is_file():
            continue
        if file_path.suffix.lower() not in SUPPORTED_EXTENSIONS:
            continue

        text = ""
        if file_path.suffix.lower() == ".pdf":
            with fitz.open(file_path) as doc:
                for page in doc:
                    text += page.get_text()
        else:
            text = file_path.read_text(encoding="utf-8", errors="ignore")

        if text.strip():
            documents.append(
                {
                    "doc_id": file_path.stem,
                    "text": text,
                    "source": str(file_path),
                }
            )

    return documents


if __name__ == "__main__":
    docs = load_documents(DATA_DIR)
    print(f"Loaded {len(docs)} documents")

    if docs:
        print("\nSample text:\n")
        print(docs[0]["text"][:500])
    else:
        print("No documents found. Check data directory path.")
