import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import helmet from 'helmet';
import loginRoute from './routes/loginRoute.js';
import registerRoute from './routes/registerRoute.js';
import userRoute from './routes/userRoute.js';
import postsRoute from './routes/postsRoute.js';
import profileRoute from './routes/profileRoute.js'; // Import profileRoute
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config(); // Load environment variables from .env

const app = express();

// Check if required environment variables are defined
if (!process.env.PORT) {
    console.error('PORT is not defined in .env');
    process.exit(1); // Exit process if required variable is missing
}

// Middleware setup
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin'],
    credentials: true // Allow cookies
}));

app.use(cookieParser());
app.use(helmet());

// Set Cross-Origin-Resource-Policy and Cross-Origin-Embedder-Policy headers globally
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Allow frontend origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin');
    next();
});

// Get directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static file handling
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res, filePath) => {
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Allow frontend origin
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin');
    }
}));

// API routes
app.use('/api', loginRoute);
app.use('/api/register', registerRoute);
app.use('/api/user', userRoute);
app.use('/api/posts', postsRoute);
app.use('/api', profileRoute); // Use profileRoute for profile-related endpoints

// Handle non-existing routes
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});

// Centralized error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
