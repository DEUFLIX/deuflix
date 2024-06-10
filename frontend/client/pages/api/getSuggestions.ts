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

    const { movieId, seriesId } = req.query;

    if (!movieId && !seriesId) {
        return res.status(400).json({ message: 'Missing movieId or seriesId' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Database connected successfully');

        let data: any;
        let genreRows: any = [];
        let actorRows: any = [];

        if (movieId) {
            const [movieRows]: any = await connection.execute(
                'SELECT * FROM movie WHERE id = ?',
                [movieId]
            );
            console.log('Movie data:', movieRows);

            if (movieRows.length === 0) {
                await connection.end();
                return res.status(404).json({ message: 'Movie not found' });
            }

            [genreRows] = await connection.execute(
                `SELECT g.genre FROM genre g
                 JOIN movie_genre mg ON g.id = mg.genre_id
                 WHERE mg.movie_id = ?`,
                [movieId]
            );

            [actorRows] = await connection.execute(
                `SELECT a.name FROM actors a
                 JOIN movie_actors ma ON a.id = ma.actor_id
                 WHERE ma.movie_id = ?`,
                [movieId]
            );

            data = movieRows[0];
        } else if (seriesId) {
            const [seriesRows]: any = await connection.execute(
                'SELECT * FROM series WHERE id = ?',
                [seriesId]
            );
            console.log('Series data:', seriesRows);

            if (seriesRows.length === 0) {
                await connection.end();
                return res.status(404).json({ message: 'Series not found' });
            }

            [genreRows] = await connection.execute(
                `SELECT g.genre FROM genre g
                 JOIN series_genre sg ON g.id = sg.genre_id
                 WHERE sg.series_id = ?`,
                [seriesId]
            );

            [actorRows] = await connection.execute(
                `SELECT a.name FROM actors a
                 JOIN series_actors sa ON a.id = sa.actor_id
                 WHERE sa.series_id = ?`,
                [seriesId]
            );

            data = seriesRows[0];
        }

        await connection.end();

        return res.status(200).json({
            id: data.id,
            title: data.title,
            description: data.description,
            suggestions: data.suggestions,
            age_restriction: data.age_restriction,
            genres: genreRows.map((row: any) => row.genre),
            seriesImage: data.seriesImage,
            seriesUrl: data.seriesUrl,
            trailer: data.trailer,
            year: data.year,
            actors: actorRows.map((row: any) => row.name) // 배우 정보 추가
        });
    } catch (error: any) {
        console.error('Database error:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
