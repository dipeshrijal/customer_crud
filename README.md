# Customer CRUD API - Setup and Usage Guide

This documentation provides comprehensive instructions for setting up and deploying the Customer CRUD API using Node.js, Docker, Minikube, and Helm. Follow these steps to get your environment ready and access the API.

---

## Prerequisites

Before you begin, ensure that you have the following installed on your machine:

- **Node.js**: [Install Node.js](https://nodejs.org/en/download/package-manager)
- **Docker**: [Install Docker](https://www.docker.com/products/docker-desktop)
- **Minikube**: [Install Minikube](https://minikube.sigs.k8s.io/docs/start/?arch=%2Fmacos%2Farm64%2Fstable%2Fbinary+download)

---

## Step 1: Start Minikube

Initialize Minikube with the required resources:

```bash
minikube start --cpus 4 --memory 8192
```

Once Minikube is up and running, you can launch the Minikube dashboard for monitoring:

```bash
minikube dashboard
```

---

## Step 2: Clone the GitHub Repository

Clone the repository containing the project:

```bash
git clone git@github.com:dipeshrijal/customer_crud.git
```

Navigate into the project directory:

```bash
cd customer_crud
```

---

## Step 3: Deploy Infrastructure with Helm

### 3.1 Package Helm Charts

Navigate to the Helm directory and package the required charts:

```bash
cd helm
helm package jaeger mongodb prometheus local-registry
```

### 3.2 Install Helm Charts

Install the packaged Helm charts sequentially:

```bash
helm install jaeger jaeger-0.1.0.tgz
helm install mongodb mongodb-0.1.0.tgz
helm install prometheus prometheus-0.1.0.tgz
helm install local-registry local-registry-0.1.0.tgz
```

---

## Step 4: Expose Services

To make your services accessible, run the Minikube tunnel:

```bash
minikube tunnel
```

This command is essential for routing traffic to your services within Minikube.

---

## Step 5: Set Up Docker Local Registry

### 5.1 Update Hosts File

Ensure that your local machine recognizes the local registry by updating the `/etc/hosts` file:

```bash
echo "127.0.0.1   local-registry-local-registry" | sudo tee -a /etc/hosts
```

### 5.2 Build and Push Docker Image

Build your Docker image and push it to the local registry:

```bash
cd ..
docker build -t local-registry-local-registry:5000/customer_crud:v1 .
docker push local-registry-local-registry:5000/customer_crud:v1
```

### 5.3 Deploy the Application

Navigate back to the Helm directory and deploy the application using the Helm chart:

```bash
cd helm
helm package customer_crud
helm install customer_crud customer_crud-0.1.0.tgz
```

---

## Step 6: Seed the Database

Populate your MongoDB database with initial data:

```bash
cd ..
npm run seed
```

---

## Step 7: Access the Application

Your application and monitoring tools are now accessible at the following URLs:

- **Customer CRUD API**: [http://localhost:3000/metrics](http://localhost:3000/metrics)
- **Jaeger UI**: [http://localhost:16686](http://localhost:16686)
- **Prometheus UI**: [http://localhost:9090](http://localhost:9090)

---

## Step 8: Authentication and API Access

### 8.1 Generate JWT Token

The API is secured using JWT tokens. Use the following `curl` command to authenticate and generate a token:

```bash
curl --location 'http://127.0.0.1:3000/api/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "admin@admin.com",
    "password": "admin"
}'
```

### 8.2 Store the Token

Store the generated token as an environment variable for easy reuse:

```bash
export TOKEN=$(curl --silent --location 'http://127.0.0.1:3000/api/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "admin@admin.com",
    "password": "admin"
}' | jq -r '.token')
```

### 8.3 Access Secured Endpoints

Use the stored token to interact with the secured endpoints of your API:

```bash
curl --location 'http://127.0.0.1:3000/api/customers' \
--header "Authorization: Bearer $TOKEN"
```

---

## Endpoints Overview

All available endpoints and their usage details are documented in the `customer_crud.postman_collection.json` file within the repository. Start by running the "Get Token" request to store the JWT token globally, enabling seamless access to subsequent endpoints.

---

By following these steps, you will have a fully functional Customer CRUD API deployed locally using Docker and Minikube, with robust monitoring and tracing capabilities provided by Prometheus and Jaeger.
