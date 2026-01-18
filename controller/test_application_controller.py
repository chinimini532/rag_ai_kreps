from controller.application_controller import ApplicationController

app = ApplicationController()

print("\n=== SYSTEM STATS ===")
print(app.get_system_stats())

print("\n=== QUERY TEST ===")
out = app.answer_query("How did Korea reduce power grid losses?")
print(out["answer"])
print(out["metrics"])

app.close()
