from controller.application_controller import ApplicationController

# Create ONE shared controller instance
_controller = ApplicationController()


def chat_api(query: str, top_k: int = 3):
    """
    Called by the Chat UI.
    """
    return _controller.answer_query(query, top_k)


def ingest_api():
    """
    Called by the Document Ingestion UI.
    """
    return _controller.ingest_documents()


def dashboard_api():
    """
    Called by the Analysis Dashboard UI.
    """
    return _controller.get_system_stats()
