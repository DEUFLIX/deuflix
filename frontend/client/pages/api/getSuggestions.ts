import type { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

const dbConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: '1234',
    database: 'movie',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { movieId } = req.query;

    if (!movieId) {
        return res.status(400).json({ message: 'Missing movieId' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Database connected successfully');

        const [movieRows]: any = await connection.execute(
            'SELECT * FROM movie WHERE id = ?',
            [movieId]
        );
        console.log('Movie data:', movieRows);

        if (movieRows.length === 0) {
            await connection.end();
            return res.status(404).json({ message: 'Movie not found' });
        }

        const [actorRows]: any = await connection.execute(
            `SELECT a.name FROM actors a
            JOIN movie_actors ma ON a.id = ma.actor_id
            WHERE ma.movie_id = ?`,
            [movieId]
        );
        console.log('Actor data:', actorRows);

        await connection.end();

        const movie = movieRows[0];

        return res.status(200).json({
            id: movie.id,
            title: movie.title,
            description: movie.description,
            suggestions: movie.suggestions,
            age_restriction: movie.age_restriction,
            actors: actorRows.map((row: any) => row.name)
        });
    } catch (error: any) {
        console.error('Database error:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
