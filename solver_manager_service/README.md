# MICROSERVICE

## solver_manager_service

**The solver_manager_service is responsible for managing the submission and queuing of problem-solving tasks. It handles receiving problem data, validating the input, and communicating with the message queue to distribute the tasks to solver services.**

Here’s a detailed breakdown of its functionality:

**1. Handles File Uploads and Inputs:**
        Accepts Python script files and optional JSON files through uploads.
        Receives and processes metadata and numerical inputs (like the number of vehicles, depot, and maximum distance).

**2. Problem Management:**
        Stores problem submissions in a MongoDB database.
        Updates the state of the problems (e.g., marking a problem as failed if required inputs are missing).

**3. Validation:**
        Ensures that the uploaded files have the correct format and necessary data is provided.
        Validates the types and values of numerical inputs.

**4. Message Queue Communication:**
        Connects to RabbitMQ and publishes the task to an exchange with a specific routing key.
        Ensures the task is added to a message queue for the solver services to process.
