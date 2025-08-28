from flask import Flask, request, jsonify, json
import uuid
import os
from runners import python_runners, node_runners
from flask_cors import CORS
from flask import Flask, send_from_directory
import os

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Pfad auf das gebaute Vue-Frontend (liegt in ui/ui/dist)
UI_DIST_DIR = os.path.join(BASE_DIR, "..", "ui", "ui", "dist")

app = Flask(
    __name__,
    static_folder=UI_DIST_DIR,
    static_url_path=""
)
CORS(app, resources={r"/run-test": {"origins": "*"}})
@app.route("/")
def serve_index():
    return send_from_directory(app.static_folder, "index.html")

# Beispiel für deine API
@app.route("/run-test", methods=["POST"])
def run_test():
    return {"status": "ok", "result": "Hello World"}

if __name__ == "__main__":
    os.makedirs("results", exist_ok=True)
    app.run(port=5000, debug=True)
