# Node.js Backend with Chat Application

This project is a Node.js backend for a chat application. It provides RESTful APIs for user authentication, messaging, and other chat-related functionalities. MongoDB is used as the database to store user information and chat messages.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js
- MongoDB

## Setup

1. **Clone the repository:**

    ```bash
    git clone <repository-url>
    ```

2. **Install dependencies:**

    ```bash
    cd <project-directory>
    npm install
    ```

3. **Set up environment variables:**

    Create a `.env` file in the root directory of the project and add the following:

    ```plaintext
    MONGO_URI=mongodb+srv://backend:backend@backend.h8uereh.mongodb.net/backend
    PORT=5000
    JWT_SECRET_KEY=Backend4#@#^&*
    JWT_EXPIRES_IN=1m
    ```

    Replace `MONGO_URI` with your MongoDB connection string. You can obtain this from your MongoDB Atlas dashboard.

4. **Running the Application:**

    To start the server, run:

    ```bash
    npm start
    ```

    The server will start running on http://localhost:5000/.

    You can access the application by navigating to [http://localhost:5000/](http://localhost:5000/) in your web browser.

5. **Accessing the Chat:**

    To log in to the chat, use the following email and password:

    - Email: bhattarainabin809@gmail.com
      Password: Test1412#@$@

    - Email: bhattarainabin64@gmail.com
      Password: Test1412#@$@

    You can also register through the provided API endpoints if you want to create your own account.

## Running the Application on a Different Host

If you want to run the application on a host other than localhost, follow these steps:

1. Update the `.env` file:
   
   Change the `PORT` variable to a port that is accessible externally.

2. Update the `npm start` command:
   
   Modify the start script in your `package.json` file to include the host.

3. Allow incoming connections through the firewall (if applicable).

## API Documentation

For API documentation and usage, refer to the API documentation provided in the project or visit the `/api-docs` endpoint when the server is running.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

