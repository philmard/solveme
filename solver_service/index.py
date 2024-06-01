import pika
import json
import subprocess
import tempfile
import base64
import os

# def decode_file(file_name, file_data):
#     decoded_data = base64.b64decode(file_data.encode('utf-8'))
#     with open(file_name, 'wb') as file:
#         file.write(decoded_data)
#     return file_name

# def execute_task(task):
#     print("execute")
#     print(task)
#     message = json.dumps({
#     "result": "result"
#     })
#     connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbitmq'))
#     channel = connection.channel()
#     channel.exchange_declare(exchange='result', exchange_type='direct')
#     channel.basic_publish(exchange='result', routing_key='solve',body=message)

#     connection.close()



#     command = ['python', py_path, json_path] + list(map(str, args))
#
#     # Execute the uploaded Python file with arguments
#     result = subprocess.run(command, capture_output=True, text=True)
#
#     # Output the result for now, but you might want to send it back or save it somewhere
#     print("Task executed with result:", result.stdout)

def callback(ch, method, properties, body):
    print(" [x] Received task")

    task = json.loads(body.decode('utf-8'))

    # Decode the Base64 encoded Python and JSON files
    py_code = base64.b64decode(task['py_file'])
    json_content = None
    if task['json_file']:
        json_content = base64.b64decode(task['json_file'])

    # Save the decoded Python and JSON files to temporary files
    with tempfile.NamedTemporaryFile(delete=False, suffix=".py") as tmp_py:
        tmp_py.write(py_code)
        py_path = tmp_py.name

    json_path = None
    if json_content:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".json") as tmp_json:
            tmp_json.write(json_content)
            json_path = tmp_json.name

    num_vehicles=task["num_vehicles"]
    depot=task["depot"]
    max_distance=task["max_distance"]

    metadata=task["metadata"]

    command = ['python', py_path, json_path, num_vehicles,depot,max_distance]

    # Execute the uploaded Python file with arguments
    result = subprocess.run(command, capture_output=True, text=True,)

    # Output the result for now, but you might want to send it back or save it somewhere
    print("Task executed with result:", result.stdout)


    message = json.dumps({
    "result": result.stdout,
    "metadata": metadata
    })
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbitmq'))
    channel = connection.channel()
    channel.exchange_declare(exchange='result', exchange_type='direct')
    channel.basic_publish(exchange='result', routing_key='solve',body=message)

    connection.close()
    ch.basic_ack(delivery_tag=method.delivery_tag)
    os.remove(py_path)
    if json_path:
        os.remove(json_path)
def consume_tasks(queue_name):
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbitmq'))
    channel = connection.channel()
    channel.exchange_declare(exchange='solver', exchange_type='direct')
    result = channel.queue_declare(queue='', exclusive=True)
    queue_name = result.method.queue
    channel.queue_bind(exchange='solver', queue=queue_name, routing_key="solve")

    channel.basic_consume(queue=queue_name, on_message_callback=callback)

    print(' [*] Waiting for tasks. To exit press CTRL+C')
    channel.start_consuming()


if __name__ == "__main__":
    queue_name = 'solve'
    consume_tasks(queue_name)
