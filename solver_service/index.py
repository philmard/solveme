import pika
import json
import subprocess
import tempfile
import base64
import os

# Callback function to process received messages from the RabbitMQ queue
def callback(ch, method, properties, body):
    print(" [x] Received task")

    # Parse the task message
    task = json.loads(body.decode('utf-8'))

    # Decode the Base64 encoded Python and JSON files
    py_code = base64.b64decode(task['py_file'])
    json_content = None
    if task['json_file']:
        json_content = base64.b64decode(task['json_file'])

    # Save the decoded Python file to a temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".py") as tmp_py:
        tmp_py.write(py_code)
        py_path = tmp_py.name

    # Save the decoded JSON file to a temporary file (if exists)
    json_path = None
    if json_content:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".json") as tmp_json:
            tmp_json.write(json_content)
            json_path = tmp_json.name

    # Extract task parameters
    num_vehicles = task["num_vehicles"]
    depot = task["depot"]
    max_distance = task["max_distance"]
    metadata = task["metadata"]

    # Command to execute the Python script with the provided arguments
    command = ['python', py_path, json_path, str(num_vehicles), str(depot), str(max_distance)]

    # Execute the uploaded Python file with arguments
    result = subprocess.run(command, capture_output=True, text=True)

    # Output the result
    print("Task executed with result:", result.stdout)

    # Prepare the result message
    message = json.dumps({
        "results": result.stdout,
        "metadata": metadata
    })

    # Connect to RabbitMQ to send the result message
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbitmq'))
    channel = connection.channel()
    channel.exchange_declare(exchange='result', exchange_type='direct')
    channel.basic_publish(exchange='result', routing_key='solve', body=message)
    connection.close()

    # Acknowledge the message
    ch.basic_ack(delivery_tag=method.delivery_tag)

    # Clean up temporary files
    os.remove(py_path)
    if json_path:
        os.remove(json_path)

# Function to consume tasks from the RabbitMQ queue
def consume_tasks(queue_name):
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbitmq'))
    channel = connection.channel()
    channel.exchange_declare(exchange='solver', exchange_type='direct')
    result = channel.queue_declare(queue='', exclusive=True)
    queue_name = result.method.queue
    channel.queue_bind(exchange='solver', queue=queue_name, routing_key="solve")

    # Set up the consumer
    channel.basic_consume(queue=queue_name, on_message_callback=callback)

    print(' [*] Waiting for tasks. To exit press CTRL+C')
    channel.start_consuming()

# Main entry point of the script
if __name__ == "__main__":
    queue_name = 'solve'
    consume_tasks(queue_name)
