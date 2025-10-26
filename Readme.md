# Prompt Manager App

This is a full-stack, cloud-native application that allows users to create, categorize, store, and manage prompts.

## Architecture Overview

The application is built using a microservices architecture.

-   **Frontend:** A SvelteKit application for the user interface.
-   **Backend:** A set of microservices built with Node.js and Express.
    -   **API Gateway:** The single entry point for all client requests.
    -   **Auth Service:** Handles user authentication and authorization.
    -   **Prompt Service:** Manages CRUD operations for prompts.
    -   **Reporting Service:** Provides analytics on prompt usage.
    -   **Notification Service:** (Future) For sending notifications to users.
-   **Messaging:** RabbitMQ is used for asynchronous communication between services.
-   **Service Discovery:** Consul is used for service registration and discovery.

## Setup Guide

To run the application locally

    ```bash
    ./start.sh
    ```

This will build the Docker images and start all the services. The application will be available at `http://localhost:5173`.

To stop the application, run:

```bash
docker-compose down
```

