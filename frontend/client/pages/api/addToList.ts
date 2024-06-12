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

    const { userId, movieId, seriesId } = req.body;

    if (!userId || (!movieId && !seriesId)) {
        return res.status(400).json({ message: 'Missing userId, movieId, or seriesId' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);

        if (movieId) {
            const [result] = await connection.execute(
                'INSERT INTO my_list (user_id, movie_id) VALUES (?, ?)',
                [userId, movieId]
            ) as any;
        }

        if (seriesId) {
            const [result] = await connection.execute(
                'INSERT INTO my_series_list (user_id, series_id) VALUES (?, ?)',
                [userId, seriesId]
            ) as any;
        }

        await connection.end();

        return res.status(200).json({ message: movieId ? 'MyList에 추가 되었습니다.' : 'Series added to list' });
    } catch (error: any) {
        console.error('Database error:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: movieId ? 'Movie already in list' : 'Series already in list' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
}
