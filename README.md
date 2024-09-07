# GraphiQL App

This project is a lightweight API client combining features of both Postman and GraphQL. It allows users to make REST and GraphQL requests, manage request history, and supports authentication and authorization using Firebase. The app is developed using React and Remix and is designed to offer an intuitive interface for testing APIs.

## Features
- REST Client: Supports making RESTful API requests with method selection, URL input, and headers.
- GraphQL Playground: Provides an interface for building and executing GraphQL queries.
- Authorization and Authentication: User authentication is managed via Firebase, ensuring access is restricted to authorized users.
- Request History: Keeps track of previously executed requests and allows users to revisit them.

## Technologies

| **Category**   | **Name**   | **Version** |
| -------------- | ---------- | ----------- |
| Language       | TypeScript | 5.1.6       |
| Framework      | Remix      | 2.11.2      |
| Library        | React      | 18.3.1      |
| State Management | Redux    | 9.1.2       |
| Authentication | Firebase   | 10.13.0     |
| Testing        | Vitest     | 2.0.5       |
| IDE            | VS Code    | 1.92.2      |
| Bundler        | Vite       | 5.4.2       |
| Preprocessor   | SASS       | 1.77.8      |
| Linters        | ESLint     | 8.38.0      |
| Code Formatter | Prettier   | 3.3.3       |

## Available Scripts

In the project directory, you can run:

Start development server:

    npm run dev

Build the project for production:

    npm run build

Start the production server:

    npm run start

Lint the code:

    npm run lint

Fix linting issues:

    npm run lint:fix

Run tests:

    npm run test

Run tests in interactive mode:

    npm run test:ui

Check code formatting:

    npm run ci:format

Fix code formatting issues:

    npm run format:fix

## Installation

Follow these steps to set up and run the project locally:

1.  Clone this repository.

        git clone hhttps://github.com/AYaki-coder/graphiql-app.git

2.  Navigate to the project directory.

        cd graphiql-app

3.  Install the project dependencies.

        npm install

4.  Start the development server.

        npm run dev

5.  Open the application in your browser.

        http://localhost:5173
