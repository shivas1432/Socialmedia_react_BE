import express from 'express';
import multer from 'multer';
import db from '../config/db.js'; // Adjust the path as necessary

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Assuming you're returning the full URL for the profile picture
router.post('/profile/update', upload.single('profilePicture'), (req, res) => {
    const { Email, nickname, tags, bio } = req.body; // Ensure Email is capitalized
    let profilePicturePath = req.file ? req.file.filename : null;

    // Check if all required fields are present
    if (!Email || !nickname) {
        return res.status(400).json({ message: 'Email and nickname are required.' });
    }

    const query = 'UPDATE userinfo2 SET nickname = ?, tags = ?, bio = ?, profilePicture = ? WHERE Email = ?';
    db.query(query, [nickname, tags, bio, profilePicturePath, Email], (error) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ message: 'Error updating profile. Please try again later.' });
        }

        // Send back the updated user info, including the profile picture URL (if available)
        const updatedUser = {
            email: Email,
            nickname,
            tags,
            bio,
            profilePicture: profilePicturePath ? `http://localhost:8081/uploads/${profilePicturePath}` : null
        };

        res.json({ message: 'Profile updated successfully!', user: updatedUser });
    });
});


export default router;
