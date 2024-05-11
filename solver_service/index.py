from flask import Flask, request, jsonify
from vrpSolver import main
app = Flask(__name__)

@app.route('/solve', methods=['POST'])
def solve():
    try:
        data = request.get_json()
        if data is None:
            return jsonify({"error": "No data provided"}), 400
        result = main(data)
        return jsonify({"result": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003)