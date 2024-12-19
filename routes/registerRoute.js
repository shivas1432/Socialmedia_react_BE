import express from 'express';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import db from '../config/db.js'; // Adjust the path as necessary

const router = express.Router();

// Set up the upload directory and ensure it exists
const uploadsDir = path.join('uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir); // Save the file to the 'uploads' directory
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`; // Unique file name
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });

// Input validation function for registration
const validateRegistrationInput = ({ username, email, password, nickname }) => {
    const errors = {};
    if (!username) errors.username = 'Username is required.';
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Valid email is required.';
    if (!password || password.length < 6) errors.password = 'Password must be at least 6 characters.';
    if (!nickname) errors.nickname = 'Nickname is required.';
    return errors;
};

router.post('/upload', upload.single('profilePicture'), async (req, res) => {
    const { username, email, password, nickname, tags, bio } = req.body;

    // Validate required fields
    if (!username || !email || !password || !nickname) {
        return res.status(400).json({ error: 'All required fields must be filled.' });
    }

    try {
        // Check if the user already exists
        const existingUser = await db.query(
            'SELECT * FROM public."userinfo2" WHERE "Email" = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'User with this email already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Handle file upload (profilePicture)
        const filePath = req.file ? path.basename(req.file.path) : null;

        // Insert user into the database
        const result = await db.query(
            `INSERT INTO public."userinfo2" 
            ("Username", "Email", "Password", "Nickname", "Tags", "Bio", "ProfilePicture") 
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING "UserId"`,
            [username, email, hashedPassword, nickname, tags, bio, filePath]
        );

        res.status(201).json({
            message: 'User registered successfully!',
            userId: result.rows[0].UserId,
        });

    } catch (error) {
        console.error('Registration Error:', error.message);
        res.status(500).json({ error: 'Server error during registration. Please try again.' });
    }
});

router.post('/profile/update', upload.single('profilePicture'), async (req, res) => {
    const { userId, nickname, tags, bio } = req.body;

    if (!userId || !nickname) {
        return res.status(400).json({ error: 'User ID and nickname are required.' });
    }

    try {
        const filePath = req.file ? path.basename(req.file.path) : null; // Use basename for consistent file handling

        // Update user profile in the database
        await db.query(
            `UPDATE public."userinfo2" 
            SET "Nickname" = $1, "Tags" = $2, "Bio" = $3, "ProfilePicture" = $4
            WHERE "UserId" = $5`,
            [nickname, tags, bio, filePath, userId]
        );

        // Construct profile picture URL dynamically
        const profilePictureUrl = filePath ? `http://localhost:8081/uploads/${filePath}` : null;

        res.json({ message: 'Profile updated successfully!', profilePictureUrl });

    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Error updating profile. Please try again.' });
    }
});

// Backend - Fetch User Details (Profile Picture URL)
router.get('/', async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const result = await db.query(
            'SELECT "Username", "Nickname", "Tags", "Bio", "ProfilePicture" FROM public."userinfo2" WHERE "Email" = $1',
            [email.trim()]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = result.rows[0];
        const profilePictureUrl = user.ProfilePicture
            ? `http://localhost:8081/uploads/${user.ProfilePicture}`
            : null;

        res.json({
            username: user.Username,
            nickname: user.Nickname,
            tags: user.Tags,
            bio: user.Bio,
            profilePicture: profilePictureUrl,
        });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ error: 'Failed to fetch user details. Please try again.' });
    }
});

export default router;
