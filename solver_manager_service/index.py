from flask import Flask, request, jsonify
import subprocess
import tempfile
import os
import pika
import json
import base64

app = Flask(__name__)

@app.route('/solve', methods=['POST'])
def upload_file():
    py_file = request.files.get('py_file')
    json_file = request.files.get('json_file')
    num_vehicles = request.form.get('num_vehicles')
    depot = request.form.get('depot')
    max_distance = request.form.get('max_distance')
    
    metadata=json.loads(request.form.get('metadata'))
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
            with open(tmp_py.name, 'rb') as py_f:
                py_base64 = base64.b64encode(py_f.read()).decode('utf-8')

        json_path = None
        if json_content:
            with tempfile.NamedTemporaryFile(delete=False, suffix=".json") as tmp_json:
                tmp_json.write(json_content.encode('utf-8'))
                json_path = tmp_json.name
            with open(json_path, 'rb') as json_f:
                json_base64 = base64.b64encode(json_f.read()).decode('utf-8')

        task = {
            'py_file': py_base64,
            'json_file': json_base64,
            'num_vehicles': num_vehicles,
            'depot': depot,
            'max_distance': max_distance,
            'metadata':metadata
        }
        message = json.dumps(task)
        # Prepare command to run the script
        connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbitmq'))
        channel = connection.channel()

        channel.exchange_declare(exchange='solver',
                                 exchange_type='direct')
        channel.basic_publish(exchange='solver',
                              routing_key='solve',
                              body=message)

        connection.close()


        # Clean up temporary files
        # os.remove(py_path)
        # if json_path:
        #     os.remove(json_path)

        return jsonify({"output": "added to queue", "error": "error"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
