# Project Name

Description of your project goes here.

## Prerequisites

Make sure you have the following installed:

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

    Replace the MongoDB URI and other values with your actual credentials.

## Running the Application

To start the server, run:

```bash
npm start
