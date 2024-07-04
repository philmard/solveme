# MICROSERVICE

## results_service

**The results_service is responsible for handling and storing the results of the solution. It interacts with RabbitMQ to receive results, updates the status of problems, and provides endpoints to manage the results.**

Here's a detailed breakdown of its functionality:

**MongoDB Connection:**
- Connects to a MongoDB database using Mongoose to store and retrieve result data.

**RabbitMQ Connection and Result Handling:**
- Establishes a connection to the RabbitMQ message broker.
- Declares an exchange named "result" and binds to the "solve" routing key.
- Listens for result messages in the queue and processes them using a callback function.

**Result Management:**
- Callback Function:
  - Called whenever a new result message is received.
  - Decodes the result message from JSON format.
  - Extracts the metadata and results from the message.
  - Saves the results to the MongoDB database.
  - Updates the problem status to "solved" or "failed" by making an HTTP request to the solver_manager_service.

**Result Endpoints:**
- Retrieve Result (GET /results/:submissionId):
  - Retrieves the result based on the provided submission ID.
  - Returns the result if found, otherwise returns a 404 error.
- Create Result (POST /results):
  - Accepts result data in the request body.
  - Creates and saves a new result in the database.
  - Returns the saved result.
- Delete Result (DELETE /results/:submissionId):
  - Deletes the result based on the provided submission ID.
  - Returns a success message upon successful deletion.
