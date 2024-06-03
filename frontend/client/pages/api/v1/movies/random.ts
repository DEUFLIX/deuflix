import type { NextApiRequest, NextApiResponse } from 'next';
import mysql, { RowDataPacket } from 'mysql2/promise';

const dbConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: '1234',
    database: 'movie',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    console.log('Received request:', req.method);  // 요청 메서드 로그

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database');

        const [rows]: [RowDataPacket[], any] = await connection.execute('SELECT * FROM movie ORDER BY RAND() LIMIT 1');
        console.log('Query executed, rows:', rows);

        await connection.end();
        console.log('Database connection closed');

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        return res.status(200).json(rows[0]);
    } catch (error: any) {
        console.error('Database error:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
