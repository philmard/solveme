**The user_service is responsible for managing user-related functionalities such as user authentication and credit management.**

Here's a detailed breakdown of its functionality:

**1. MongoDB Connection:**
        Connects to a MongoDB database using Mongoose to manage user data.

**2. User Management Endpoints:**
        Create User (POST /users):
            Accepts username and password in the request body.
            Checks if a user with the same username already exists.
            If not, creates and saves a new user in the database.
        Retrieve User (GET /users/:username):
            Retrieves user information based on the provided username.
            Returns the user details if found, otherwise returns a 404 error.
        Add Credits (PUT /users/:username/add-credit):
            Accepts credits in the request body.
            Finds the user by username and increments their credits by the specified amount.
            Saves the updated user data and returns it.
        Remove Credits (PUT /users/:username/remove-credit):
            Finds the user by username and decrements their credits by one.
            Saves the updated user data and returns it.
