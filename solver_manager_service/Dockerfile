# Use an official Python runtime as a parent image
FROM python:3.8-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements.txt file into the container at /app
COPY requirements.txt /app/

# Install any needed packages specified in requirements.txt in a virtual environment
RUN python -m venv venv
RUN . venv/bin/activate && pip install --upgrade pip && pip install -r requirements.txt

# Copy the current directory contents into the container at /app
COPY . /app

# Make port 5003 available to the world outside this container
EXPOSE 5000

# Define environment variable to ensure output is sent straight to terminal without buffering
ENV PYTHONUNBUFFERED 1


# Use ENTRYPOINT to activate virtual environment and run the app
ENTRYPOINT ["/bin/bash", "-c", "source venv/bin/activate && exec python index.py"]
