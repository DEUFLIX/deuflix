// /pages/api/addToList.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

const dbConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: '1234',
    database: 'movie',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { userId, movieId } = req.body;

    if (!userId || !movieId) {
        return res.status(400).json({ message: 'Missing userId or movieId' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'INSERT INTO my_list (user_id, movie_id) VALUES (?, ?)',
            [userId, movieId]
        ) as any;
        await connection.end();

        return res.status(200).json({ message: 'Movie added to list' });
    } catch (error: any) {
        console.error('Database error:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Movie already in list' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
}
