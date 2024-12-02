
# **Jira Worklog Query React App**

A React application that queries Jira worklogs for a specific user and date, served statically via Nginx in a Docker container. The application includes a backend Express server to securely handle API requests to Jira, utilizing Docker and Docker Compose for containerization.

---

## **Table of Contents**

- [Project Overview](#project-overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Docker and Docker Compose](#docker-and-docker-compose)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## **Project Overview**

This project converts a simple Node.js Express application into a React application. The frontend is built with React and Bootstrap for styling, while the backend uses Express to interact with the Jira REST API. The application allows users to input a username and date to retrieve worklogs from Jira.

The application is containerized using Docker and orchestrated with Docker Compose. Nginx serves the static React files and acts as a reverse proxy to the backend server.

---

## **Features**

- **React Frontend**: A responsive user interface built with React and Bootstrap.
- **Express Backend**: An Express server that securely handles API requests to Jira.
- **Dockerized Deployment**: Containerization using Docker and Docker Compose for easy deployment.
- **Nginx Reverse Proxy**: Nginx serves static files and proxies API requests to the backend.
- **Environment Variables**: Secure handling of sensitive information using environment variables.

---

## **Prerequisites**

Before you begin, ensure you have met the following requirements:

- **Node.js and npm**: Install from [Node.js official website](https://nodejs.org/).
- **Docker**: Install from [Docker official website](https://www.docker.com/get-started).
- **Docker Compose**: Usually comes with Docker Desktop; verify with `docker-compose --version`.

---

## **Project Structure**

```
jira-worklog-app/
├── docker-compose.yml
├── Dockerfile
├── nginx.conf
├── README.md
├── server/
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── package.json
├── package-lock.json
├── public/
│   └── index.html
└── src/
    ├── App.js
    └── index.js
```

---

## **Installation**

Follow these steps to set up the project on your local machine:

### **1. Clone the Repository**

```bash
git clone https://github.com/theabubakkar/jira-app.git
cd jira-app
```

### **2. Install Frontend Dependencies**

```bash
npm install
```

### **3. Install Backend Dependencies**

```bash
cd server
npm install
cd ..
```

---

## **Configuration**

### **1. Set Up Environment Variables**

Create a `.env` file in the project root (same level as `docker-compose.yml`) and add the following:

```env
JIRA_ACCESS_TOKEN=your_actual_access_token
```

**Note**: Replace `your_actual_access_token` with your Jira access token. Do not commit this file to version control.

### **2. Nginx Configuration**

The `nginx.conf` file is already configured to serve the React app and proxy API requests to the backend server. You can modify it if needed.

---

## **Usage**

### **1. Running with Docker Compose**

Build and start the Docker containers:

```bash
docker-compose up --build -d
```

This command will:

- Build the frontend React app and serve it with Nginx.
- Build the backend Express server.
- Start both services defined in `docker-compose.yml`.

### **2. Access the Application**

Open your web browser and navigate to:

```
http://localhost:3000
```

You should see the **MRS Jira Worklog Query** application.

---

## **Docker and Docker Compose**

### **docker-compose.yml**

Defines two services:

- **frontend**: Builds the React app and serves it with Nginx.
- **backend**: Runs the Express server to handle API requests.

```yaml
version: '3'

services:
  frontend:
    build: .
    ports:
      - '80:80'
    depends_on:
      - backend

  backend:
    build:
      context: ./server
    expose:
      - '5000'
    environment:
      - JIRA_ACCESS_TOKEN=${JIRA_ACCESS_TOKEN}
```

### **Frontend Dockerfile**

```dockerfile
# Dockerfile

# Build stage
FROM node:14-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . ./
RUN npm run build

# Production stage
FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### **Backend Dockerfile**

```dockerfile
# server/Dockerfile

FROM node:14-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

---

## **Environment Variables**

The backend server requires the Jira access token to authenticate API requests.

- **JIRA_ACCESS_TOKEN**: Your Jira access token.

Set this variable in your `.env` file or your deployment environment.

---

## **Detailed Explanation**

### **Frontend (React App)**

- **`src/App.js`**: Contains the main React component that renders the form and handles user input.
- **Dependencies**:
  - `axios` for making HTTP requests.
  - `bootstrap` for styling.
  - `moment` for date formatting.

```jsx
// src/App.js

import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';

function App() {
  // ... [rest of the code as previously provided]
}

export default App;
```

### **Backend (Express Server)**

- **`server/server.js`**: Handles the `/api/worklog` endpoint, making requests to the Jira API.
- **Dependencies**:
  - `express` for setting up the server.
  - `axios` for making HTTP requests to Jira.
  - `moment` for date manipulation.

```javascript
// server/server.js

const express = require('express');
const axios = require('axios');
const moment = require('moment');

// ... [rest of the code as previously provided]
```

---

## **Notes**

- **CORS Issues**: By using Nginx as a reverse proxy, the application avoids CORS issues.
- **Security**: Sensitive information like the Jira access token is handled using environment variables.
- **Customization**: You can modify the frontend or backend according to your needs.

---

## **Contributing**

Contributions are welcome! Please open an issue or submit a pull request for any improvements.

---

## **License**

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## **Contact**

If you have any questions or need further assistance, feel free to reach out:

- **Author**: Abu Bakkar Siddique
- **Email**: your.email@example.com

---

**Disclaimer**: This project is intended for educational purposes. Ensure you have the necessary permissions and comply with all applicable laws and terms of service when interacting with Jira or any other third-party APIs.
