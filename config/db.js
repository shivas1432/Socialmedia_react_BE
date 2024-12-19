import pg from 'pg';
const { Client } = pg;

import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // Important for Render's SSL connection
    },
});

client.connect()
    .then(() => {
        console.log('Database connected successfully');
        
        // Query to get the current database name
        return client.query('SELECT current_database()');
    })
    .then((res) => {
        console.log(`Connected to the database: ${res.rows[0].current_database}`);
    })
    .catch((err) => console.error('Database connection error', err));

export default client;
