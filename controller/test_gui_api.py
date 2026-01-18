from controller.gui_api import chat_api, dashboard_api

print("=== DASHBOARD ===")
print(dashboard_api())

print("\n=== CHAT ===")
out = chat_api("How did Korea reduce power grid losses?")
print(out["answer"])
print(out["metrics"])

