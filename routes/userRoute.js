import express from 'express';
import db from '../config/db.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the uploads directory
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File type validation (allow only images)
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true); // File is valid
        } else {
            cb(new Error('Only image files are allowed!'), false); // Reject non-image files
        }
    }
});
router.get('/', (req, res) => {
    const { email } = req.query; // Extract email from query parameters

    console.log('Received email:', email); // Log received email

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    db.query(
        'SELECT "Username", "Nickname", "Tags", "Bio", "ProfilePicture" FROM "userinfo2" WHERE LOWER("Email") = LOWER($1)',
        [email],
        (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Failed to fetch user details' });
            }

            console.log('Query result:', results.rows); // Log query results

            if (results.rows.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            const user = results.rows[0];
            user.ProfilePicture = user.ProfilePicture
                ? `http://localhost:8081/uploads/${user.ProfilePicture}`
                : '/default-profile.jpeg';

            res.json(user);
        }
    );
});


// Handle profile picture upload
router.post('/uploadProfilePicture', upload.single('profilePicture'), async (req, res) => {
    const { email } = req.body; // Get email from the request body
    const filePath = req.file ? req.file.filename : null;

    if (!email || !filePath) {
        return res.status(400).json({ error: 'Invalid request. Email and file are required.' });
    }

    try {
        const query = `
            UPDATE "userinfo2" 
            SET "ProfilePicture" = $1 
            WHERE LOWER("Email") = LOWER($2)
        `;
        await db.query(query, [filePath, email]);

        res.json({
            message: 'Profile picture uploaded successfully',
            filePath: `http://localhost:8081/uploads/${filePath}` // Return the full URL
        });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Failed to update profile picture' });
    }
});

export default router;
