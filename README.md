# Setup and Usage Documentation

## Install Docker

To install Docker, follow the instructions at [Docker Installation](https://www.docker.com/products/docker-desktop/).

## Install Minikube

To install Minikube, follow the instructions at [Minikube Installation](https://minikube.sigs.k8s.io/docs/start/?arch=%2Fmacos%2Farm64%2Fstable%2Fbinary+download).

## Start Minikube

Start Minikube with the following command:

```bash
minikube start --cpus 4 --memory 8192
```

## Clone the GitHub repository

```bash
git clone git@github.com:dipeshrijal/customer_crud.git
```

## Setup Docker Local Registry

Run a local Docker registry:

```bash
docker run --rm -d -p 5000:5000 --name registry registry:2
```

Navigate to the project directory:

```bash
cd customer_crud
```

Build and push Docker image to the local registry:

```bash
docker build -t localhost:5000/customer_curd:demo1 .
docker push localhost:5000/customer_curd:demo1
docker pull localhost:5000/customer_curd:demo1
```

## Deploy with Helm

Once Minikube is started, navigate to the Helm directory and package the Helm charts:

```bash
cd helm
helm package customer_crud
helm package jaeger
```

Install the Helm charts:

```bash
helm install customer_crud customer_crud-0.1.0.tgz
helm install jaeger jaeger-0.1.0.tgz
```

## Expose Services

Expose services with Minikube tunnel:

```bash
minikube tunnel
```

## Access the Application

- **Application**: [http://localhost:3000/metrics](http://localhost:3000/metrics)
- **Jaeger UI**: [http://localhost:16686](http://localhost:16686)

## Authentication

The API uses JWT token authentication. Use the following `curl` command to generate a token:

```bash
curl --location 'http://127.0.0.1:3000/api/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "admin@admin.com",
    "password": "admin"
}'
```

Store the token as an environment variable:

```bash
export TOKEN=$(curl --silent --location 'http://127.0.0.1:3000/api/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "admin@admin.com",
    "password": "admin"
}' | jq -r '.token')
```

Use the token to access secured endpoints:

```bash
curl --location 'http://127.0.0.1:3000/api/customers' \
--header "Authorization: Bearer $TOKEN"
```

## Endpoints

A list of all available endpoints is provided in `customer_crud.postman_collection.json`. Run the "Get Token" route first to store the JWT token as a global variable, which can be used in subsequent routes without copying it.
