import pika
import json
import subprocess
import tempfile
import base64
import os

def decode_file(file_name, file_data):
    decoded_data = base64.b64decode(file_data.encode('utf-8'))
    with open(file_name, 'wb') as file:
        file.write(decoded_data)
    return file_name

def execute_task(task):
    print("execute")
    message = json.dumps({
    "result": "result"
    })
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbitmq'))
    channel = connection.channel()
    channel.exchange_declare(exchange='result', exchange_type='direct')
    channel.basic_publish(exchange='result', routing_key='solve',body=message)

    connection.close()



#     command = ['python', py_path, json_path] + list(map(str, args))
#
#     # Execute the uploaded Python file with arguments
#     result = subprocess.run(command, capture_output=True, text=True)
#
#     # Output the result for now, but you might want to send it back or save it somewhere
#     print("Task executed with result:", result.stdout)

def callback(ch, method, properties, body):
    print(" [x] Received task")
    task = json.loads(body)
    execute_task(task)
    ch.basic_ack(delivery_tag=method.delivery_tag)

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
