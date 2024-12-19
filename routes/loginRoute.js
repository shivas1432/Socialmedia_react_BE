import express from 'express';
import bcrypt from 'bcrypt';
import db from '../config/db.js'; // Ensure the database connection is configured correctly

const router = express.Router();

router.post('/login', async (req, res) => {
    let { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Sanitize the email (trim spaces)
    email = email.trim();

    try {
        // Log the query and parameters to check what is being sent
        console.log('Executing query:', `
            SELECT "UserId", "Username", "Nickname", "Tags", "Bio", "ProfilePicture", "Password"
            FROM public."userinfo2"
            WHERE LOWER("Email") = LOWER($1)
        `);
        console.log('With parameters:', [email]);

        // Query to fetch the user details (including password hash) based on email
        const result = await db.query(
            'SELECT "UserId", "Username", "Nickname", "Tags", "Bio", "ProfilePicture", "Password" FROM public."userinfo2" WHERE LOWER("Email") = LOWER($1)',
            [email]
        );

        // Check the result after executing the query
        console.log('Query result:', result.rows);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email.' });
        }

        const user = result.rows[0];  // Extract the user from the result
        const hashedPassword = user.Password;  // Get the hashed password from the database

        // Compare the provided password with the hashed password from the database
        const isMatch = await bcrypt.compare(password, hashedPassword);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid password.' });
        }

        // Successful login logic
        res.status(200).json({
            message: 'Login successful!',
            user: {
                id: user.UserId,
                username: user.Username,
                email: email,
                nickname: user.Nickname,
                tags: user.Tags,
                bio: user.Bio,
                profilePicture: user.ProfilePicture,
            }
        });

    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ error: 'Server error. Please try again later.', details: error.message });
    }
});

export default router;
