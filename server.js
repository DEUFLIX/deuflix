const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const axios = require('axios');

const IMP_KEY = '1782823374086270';
const IMP_SECRET = 'awxZk8x4xrccPnFhmxJ7U7vjbOuh16tJ6TRfLmDHv4xVHFKTA6T8HgrXxSDkf51k59mljgL1OuMWOLq2';

const app = express();

const corsOptions = {
    origin: 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '1234',
    database: 'movie',
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    }
    console.log('Database connected!');
});

app.options('*', cors(corsOptions)); // Preflight 요청에 대한 응답

app.post('/api/auth/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const userName = email.split('@')[0];
        const query = 'INSERT INTO users (email, user_name, password) VALUES (?, ?, ?)';
        db.query(query, [email, userName, hashedPassword], (err, results) => {
            if (err) {
                console.error('Error registering user:', err);
                return res.status(500).send('Error registering user');
            }
            res.status(200).send('User registered successfully');
        });
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).send('Error registering user');
    }
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error('Error logging in:', err);
            return res.status(500).send('Error logging in');
        }
        if (results.length === 0) {
            return res.status(401).send('Invalid email or password');
        }
        const user = results[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).send('Invalid email or password');
        }
        res.status(200).send({
            id: user.id,
            email: user.email,
            user_name: user.user_name,
        });
    });
});

app.get('/api/check-email', (req, res) => {
    const { email } = req.query;
    if (!email) {
        return res.status(400).send('Email is required');
    }
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Error checking email:', err);
            return res.status(500).send('Error checking email');
        }
        res.status(200).json({ exists: results.length > 0 });
    });
});

app.post('/api/create-payment', async (req, res) => {
    const { userId, membershipType, amount } = req.body;

    if (!userId || !membershipType || !amount) {
        return res.status(400).send('모든 필드는 필수입니다.');
    }

    try {
        const getToken = await axios.post('https://api.iamport.kr/users/getToken', {
            imp_key: IMP_KEY,
            imp_secret: IMP_SECRET,
        });

        const { access_token } = getToken.data.response;
        const merchant_uid = `mid_${new Date().getTime()}`;
        const paymentPrepare = await axios.post('https://api.iamport.kr/payments/prepare', {
            merchant_uid,
            amount,
        }, {
            headers: { Authorization: access_token }
        });

        if (paymentPrepare.data.code !== 0) {
            console.error('결제 준비 중 오류 발생:', paymentPrepare.data);
            return res.status(500).send('결제 준비 중 오류 발생');
        }

        const paymentQuery = 'INSERT INTO payments (user_id, payment_status, amount, merchant_uid) VALUES (?, ?, ?, ?)';
        db.query(paymentQuery, [userId, 'ready', amount, merchant_uid], (err, results) => {
            if (err) {
                console.error('Error saving payment information:', err);
                return res.status(500).send('Error saving payment information');
            }
            res.status(200).send({ merchant_uid });
        });
    } catch (error) {
        console.error('결제 생성 중 오류 발생:', error);
        res.status(500).send(`결제 생성 중 오류 발생: ${error.message}`);
    }
});

app.post('/api/verify-payment', async (req, res) => {
    const { imp_uid, merchant_uid, userId, membershipType } = req.body;

    console.log('Request body:', req.body); // 요청 본문 출력

    try {
        const getToken = await axios.post('https://api.iamport.kr/users/getToken', {
            imp_key: IMP_KEY,
            imp_secret: IMP_SECRET,
        });

        const { access_token } = getToken.data.response;
        const paymentVerify = await axios.get(`https://api.iamport.kr/payments/${imp_uid}`, {
            headers: { Authorization: access_token }
        });

        const paymentData = paymentVerify.data.response;
        console.log('Payment data:', paymentData); // 결제 데이터 출력

        const query = 'SELECT amount, user_id FROM payments WHERE merchant_uid = ?';
        db.query(query, [merchant_uid], (err, results) => {
            if (err) {
                console.error('Error querying payment information:', err);
                return res.status(500).send('Error verifying payment');
            }
            if (results.length === 0) {
                return res.status(400).send('No payment found');
            }
            const amountToPay = results[0].amount;
            const paymentDataAmount = paymentData.amount;
            const userId = results[0].user_id;

            if (parseFloat(amountToPay) !== parseFloat(paymentDataAmount)) {
                return res.status(400).send(`결제 금액 불일치: { amountToPay: '${amountToPay}', paymentDataAmount: ${paymentDataAmount} }`);
            }

            const updateQuery = 'UPDATE payments SET payment_status = ? WHERE merchant_uid = ?';
            db.query(updateQuery, ['paid', merchant_uid], (err, results) => {
                if (err) {
                    console.error('Error updating payment status:', err);
                    return res.status(500).send('Error updating payment status');
                }

                const updateMembershipQuery = 'INSERT INTO memberships (user_id, membership_type, start_date, end_date) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE membership_type = VALUES(membership_type), start_date = VALUES(start_date), end_date = VALUES(end_date)';
                db.query(updateMembershipQuery, [userId, membershipType, new Date(), new Date(new Date().setMonth(new Date().getMonth() + 1))], (err, results) => {
                    if (err) {
                        console.error('Error updating user membership:', err);
                        return res.status(500).send('Error updating user membership');
                    }
                    res.status(200).send('결제가 완료되었습니다.');
                });
            });
        });
    } catch (error) {
        console.error('결제 검증 중 오류 발생:', error);
        res.status(500).send(`결제 검증 중 오류 발생: ${error.message}`);
    }
});

app.post('/api/save-payment', (req, res) => {
    const { userId, membershipType, amount, paymentStatus, merchant_uid } = req.body;

    if (!userId || !membershipType || !amount || !paymentStatus || !merchant_uid) {
        return res.status(400).send('모든 필드는 필수입니다.');
    }

    const query = 'INSERT INTO payments (user_id, membership_type, amount, payment_status, merchant_uid) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [userId, membershipType, amount, paymentStatus, merchant_uid], (err, results) => {
        if (err) {
            console.error('Error saving payment information:', err);
            return res.status(500).send('결제 정보 저장 중 오류가 발생했습니다.');
        }
        res.status(200).send('결제 정보가 성공적으로 저장되었습니다.');
    });
});

app.listen(8081, () => {
    console.log('Server running on port 8081');
});
