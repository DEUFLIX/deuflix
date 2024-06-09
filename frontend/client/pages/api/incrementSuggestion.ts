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

    const { movieId, seriesId } = req.body;

    if (!movieId && !seriesId) {
        return res.status(400).json({ message: 'Missing movieId or seriesId' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);

        if (movieId) {
            await connection.execute(
                'UPDATE movie SET suggestions = suggestions + 1 WHERE id = ?',
                [movieId]
            );
        }

        if (seriesId) {
            await connection.execute(
                'UPDATE series SET suggestions = suggestions + 1 WHERE id = ?',
                [seriesId]
            );
        }

        await connection.end();

        return res.status(200).json({ message: 'Suggestion incremented' });
    } catch (error: any) {
        console.error('Database error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
