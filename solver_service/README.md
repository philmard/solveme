# MICROSERVICE

## solver_service

**The solver_service is responsible for receiving, processing, and executing problem-solving tasks. It interacts with RabbitMQ to consume tasks from a message queue, executes the tasks using the provided Python scripts, and returns the results.**

Here's a detailed breakdown of its functionality:

**RabbitMQ Connection:**
- Establishes a connection to the RabbitMQ message broker.
- Declares an exchange named "solver" and binds to the "solve" routing key.
- Listens for tasks in the queue and processes them using the callback function.

**Task Execution:**
- Constructs the command to execute the Python script with the necessary arguments (number of vehicles, depot, max distance).
- Runs the Python script using the subprocess module and captures the output.

**Result Handling:**
- Constructs a result message containing the script's output and task metadata.
- Publishes the result message to the "result" exchange in RabbitMQ with the "solve" routing key.

**Cleanup:**
- Acknowledges the message to RabbitMQ to remove it from the queue.
- Deletes the temporary files used for the Python script and JSON data.
