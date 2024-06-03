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

        const [seriesRows]: any = await connection.execute(
            'SELECT * FROM series ORDER BY RAND() LIMIT 1'
        );
        console.log('Random Series data:', seriesRows);

        if (seriesRows.length === 0) {
            await connection.end();
            return res.status(404).json({ message: 'Series not found' });
        }

        const seriesId = seriesRows[0].id;

        const [episodesRows]: any = await connection.execute(
            'SELECT * FROM episodes WHERE series_id = ? ORDER BY episode_number',
            [seriesId]
        );
        console.log('Episodes data:', episodesRows);

        await connection.end();

        const series = seriesRows[0];
        series.episodes = episodesRows;

        return res.status(200).json(series);
    } catch (error: any) {
        console.error('Database error:', error);  // 구체적인 오류 메시지 출력
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
