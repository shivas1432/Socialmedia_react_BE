Backend - Social Media Web Application

This is the backend part of the Social Media Web Application built using Node.js, Express, and PostgreSQL.

Features
User Authentication (Login & Registration)
User Profile management (View & Update)
Post Management (Create & View Posts)
Pagination for posts
Cross-Origin Resource Sharing (CORS) setup for frontend communication

Prerequisites

Before running the backend, ensure that you have the following:

Node.js installed
PostgreSQL database or a PostgreSQL service (e.g., Render)
Environment Variables set up as defined below

Installation

Clone the Repository

git clone https://github.com/shivas1432/SMbackend.git
cd scoial-media
Install Dependencies
Run the following command to install the required dependencies:

npm install
Set Up Environment Variables
Create a .env file in the root directory and set the required variables:

DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=Shivas1432@12
DB_DATABASE=social
FRONTEND_URL=http://localhost:3000

JWT_SECRET=6ce59dc43eb40c2df7caed9025a4005d7f7fa9a3612e7f942c5a5b71cc16ecd6a0f3129c475e5b5f11e6c90058d4ecb0835a9b139920d9f315d809b6016da1fd
PORT=8081
DATABASE_URL=postgresql://shiva:xZFbcX9o73wfY9FxKdndzSccIpz1UHlH@dpg-ctdgg6d6l47c73chns3g-a.oregon-postgres.render.com/shiva_u08h
Running the Server
Start the development server with:


npm run dev
The backend will be available at http://localhost:8081.

API Endpoints
POST /api/register: Register a new user
POST /api/login: Authenticate a user
GET /api/user: Fetch user details
POST /api/profile/update: Update user profile
GET /api/posts: Fetch posts (supports pagination)
Database Configuration
The backend uses PostgreSQL for storing data. Ensure that your database is set up and connected correctly through the environment variables.

Notes
The server is configured to work with CORS, ensuring proper communication with the frontend at http://localhost:3000.
