import axios from 'axios';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import NetflixLayout from '../components/NetflixLayout';
import { useUser } from '../context/UserContext';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setState } = useUser();
    const router = useRouter();

    useEffect(() => {
        const queryEmail = router.query.email;
        if (queryEmail) {
            setEmail(queryEmail as string);
        }
    }, [router.query.email]);

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:8081/api/auth/login', {
                email,
                password,
            });

            if (response.status === 200) {
                const user = response.data;
                localStorage.setItem('auth', JSON.stringify(user));
                setState(user);
                router.push('/Step3');
            } else {
                toast.error('로그인 중 오류가 발생했습니다.');
            }
        } catch (error) {
            toast.error('로그인 중 오류가 발생했습니다.');
        }
    };

    return (
        <NetflixLayout>
            <div className="flex flex-col items-center justify-center min-h-screen bg-white">
                <div className="max-w-md w-full text-center">
                    <h1 className="text-2xl font-bold mb-4 text-black">회원님, 반갑습니다.</h1>
                    <p className="mb-4 text-black">
                        넷플릭스 가입 절차는 간단합니다.
                        <br />
                        비밀번호를 입력하시면 바로 시청하실 수 있습니다.
                    </p>
                    <div className="mb-4">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded text-black"
                            placeholder="이메일 주소"
                        />
                    </div>
                    <div className="mb-6">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded text-black"
                            placeholder="비밀번호를 입력하세요"
                        />
                    </div>
                    <button
                        onClick={handleLogin}
                        className="w-full bg-red-600 text-white py-3 rounded font-bold"
                    >
                        다음
                    </button>
                    <div className="mt-4 text-center">
                        <a href="#" className="text-blue-600">비밀번호를 잊으셨나요?</a>
                    </div>
                </div>
            </div>
        </NetflixLayout>
    );
};

export default LoginPage;
