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

    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Database connected successfully');

        // 무작위 시리즈 정보를 가져옴
        const [seriesRows]: any = await connection.execute(
            'SELECT * FROM series ORDER BY RAND() LIMIT 1'
        );
        console.log('Random Series data:', seriesRows);

        if (seriesRows.length === 0) {
            await connection.end();
            return res.status(404).json({ message: 'Series not found' });
        }

        const seriesId = seriesRows[0].id;

        await connection.end();

        const series = seriesRows[0];

        return res.status(200).json({
            id: series.id,
            title: series.title,
            description: series.description,
            suggestions: series.suggestions,
            age_restriction: series.age_restriction,
            thumbnailImage: series.thumbnail_image,
            trailerUrl: series.trailer_url,
            year: series.year
        });
    } catch (error: any) {
        console.error('Database error:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
