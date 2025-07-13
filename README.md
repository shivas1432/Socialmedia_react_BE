# Social Media Backend

A robust Node.js backend API for a social media web application with user authentication, profile management, and post handling.

## Features

### User Management
- User registration and authentication
- JWT token-based security
- Profile management and updates
- Secure password handling

### Content Management
- Post creation and retrieval
- Pagination support for posts
- File upload handling
- Real-time data management

### Security & Performance
- CORS configuration for frontend communication
- Environment variable protection
- PostgreSQL database integration
- Error handling and validation

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Multer** - File uploads

## Quick Start

```bash
# Clone the repository
git clone https://github.com/shivas1432/Socialmedia_react_BE.git

# Navigate to project
cd Socialmedia_react_BE

# Install dependencies
npm install

# Start development server
npm run dev
```

Server runs at: `http://localhost:8081`

## Configuration

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_HOST=127.0.0.1
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_DATABASE=social

# Application Settings
PORT=8081
FRONTEND_URL=http://localhost:3000

# Security
JWT_SECRET=your_jwt_secret_key

# PostgreSQL URL (for cloud deployment)
DATABASE_URL=your_postgresql_connection_string
```

## API Endpoints

### Authentication
```
POST /api/register        # User registration
POST /api/login          # User login
```

### User Management
```
GET /api/user            # Fetch user details
POST /api/profile/update # Update user profile
```

### Posts
```
GET /api/posts           # Fetch posts with pagination
POST /api/posts          # Create new post
```

## Project Structure

```
Socialmedia_react_BE/
├── config/              # Database configuration
├── routes/              # API route handlers
├── uploads/             # File upload directory
├── server.js            # Main server file
├── generateJwtSecret.js # JWT secret generator
├── package.json         # Dependencies
└── .env                # Environment variables
```

## Database Setup

### Prerequisites
- PostgreSQL installed locally or cloud service
- Database named `social` created

### Connection
The application supports both local and cloud PostgreSQL connections:
- Local: Uses individual DB_* environment variables
- Cloud: Uses DATABASE_URL for services like Render

## Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt for password security
- **CORS Protection** - Configured for frontend communication
- **Environment Variables** - Sensitive data protection

## Development

### Scripts
```bash
npm run dev    # Start development server with nodemon
npm start      # Start production server
```

### File Uploads
The application handles file uploads in the `/uploads` directory using Multer middleware.

## Deployment

### Environment Setup
1. Set up PostgreSQL database
2. Configure environment variables
3. Install dependencies
4. Start the server

### Cloud Deployment
- Supports PostgreSQL cloud services (Render, Heroku, etc.)
- Use DATABASE_URL for cloud database connections
- Ensure CORS settings match your frontend URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Note**: Ensure your PostgreSQL database is running and properly configured before starting the server.
