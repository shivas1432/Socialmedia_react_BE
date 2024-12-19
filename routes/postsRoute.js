import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// Endpoint for fetching posts with pagination
router.get('/', (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Pagination (default values for page and limit)
    const offset = (page - 1) * limit;

    db.query('SELECT * FROM public.social1 LIMIT $1 OFFSET $2', [parseInt(limit), parseInt(offset)], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to fetch posts' });
        }
        res.json(results.rows);
    });
});

export default router;
