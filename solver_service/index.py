from flask import Flask, request, jsonify
import subprocess
import tempfile
import os


app = Flask(__name__)

@app.route('/solve', methods=['POST'])
def upload_file():
    py_file = request.files.get('py_file')
    json_file = request.files.get('json_file')
    num_vehicles = request.form.get('num_vehicles')
    depot = request.form.get('depot')
    max_distance = request.form.get('max_distance')

    if not py_file:
        return jsonify({"error": "No Python script part in the request"}), 400

    if py_file.filename == '':
        return jsonify({"error": "No selected Python script"}), 400
    if not py_file.filename.endswith('.py'):
        return jsonify({"error": "Invalid file type. Only .py files are allowed."}), 400

    if not all([num_vehicles, depot, max_distance]):
        return jsonify({"error": "Three numerical arguments are required"}), 400

    try:
        # Validate and convert arguments to integers
        args = [int(num_vehicles), int(depot), int(max_distance)]
    except ValueError:
        return jsonify({"error": "All arguments must be integers"}), 400

    json_content = None
    if json_file:
        if json_file.filename.endswith('.json'):
            json_content = json_file.read().decode('utf-8')
        else:
            return jsonify({"error": "Invalid file type. Only .json files are allowed."}), 400

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".py") as tmp_py:
            py_file.save(tmp_py.name)
            py_path = tmp_py.name

        json_path = None
        if json_content:
            with tempfile.NamedTemporaryFile(delete=False, suffix=".json") as tmp_json:
                tmp_json.write(json_content.encode('utf-8'))
                json_path = tmp_json.name

        # Prepare command to run the script
        command = ['python', py_path, json_path] + list(map(str, args))
        

        # Execute the uploaded Python file with arguments
        result = subprocess.run(command, capture_output=True, text=True)

        # Clean up temporary files
        os.remove(py_path)
        if json_path:
            os.remove(json_path)

        return jsonify({"output": result.stdout, "error": result.stderr})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003)
