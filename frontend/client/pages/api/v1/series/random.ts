import type { NextApiRequest, NextApiResponse } from 'next';
import mysql, { RowDataPacket } from 'mysql2/promise';

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

        const [rows]: [RowDataPacket[], any] = await connection.execute('SELECT * FROM series ORDER BY RAND() LIMIT 1');

        await connection.end();

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Series not found' });
        }

        return res.status(200).json(rows[0]);
    } catch (error: any) {
        console.error('Database error:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
