import axios from 'axios';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import NetflixLayout from '../components/NetflixLayout';
import { useUser } from '../context/UserContext';

const Step2 = () => {
    const [password, setPassword] = useState('');
    const router = useRouter();
    const { email } = router.query;
    const { setState } = useUser();

    useEffect(() => {
        if (!email) {
            toast.error('유효한 이메일이 필요합니다.');
            router.push('/Step1');
        }
    }, [email]);

    const handleFinish = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error('유효한 이메일이 필요합니다.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8081/api/auth/register', {
                email,
                password,
            });

            if (response.status === 200) {
                const loginResponse = await axios.post('http://localhost:8081/api/auth/login', {
                    email,
                    password,
                });

                if (loginResponse.status === 200) {
                    const user = loginResponse.data;
                    localStorage.setItem('auth', JSON.stringify(user));
                    setState(user);
                    toast.success('회원가입이 완료되었습니다.');
                    router.push('/Step3');
                } else {
                    toast.error('로그인 중 오류가 발생했습니다.');
                }
            } else {
                toast.error('회원가입 중 오류가 발생했습니다.');
                console.error('Error:', response.status, response.data);
            }
        } catch (error) {
            toast.error('회원가입 중 오류가 발생했습니다.');
            console.error('회원가입 중 오류:', error);
        }
    };

    return (
        <NetflixLayout>
            <div className="flex flex-col items-center justify-center min-h-screen bg-white">
                <div className="max-w-md w-full text-center">
                    <h2 className="text-xl font-bold mb-4">비밀번호를 설정해 멤버십을 시작하세요</h2>
                    <form className="space-y-4" onSubmit={handleFinish}>
                        <div>
                            <label className="block text-gray-700">이메일 주소</label>
                            <input
                                type="email"
                                value={email as string}
                                readOnly
                                className="w-full p-2 border border-gray-300 rounded text-black"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">비밀번호를 추가하세요</label>
                            <input
                                type="password"
                                className="w-full p-2 border border-gray-300 rounded text-black"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <input type="checkbox" className="mr-2" required />
                            <label className="text-gray-600">예, 저는 개인정보 처리방침에 따른 개인정보 수집 및 활용에 동의합니다.</label>
                        </div>
                        <div>
                            <input type="checkbox" className="mr-2" />
                            <label className="text-gray-600">예, 넷플릭스 특별 할인 등 관련 이메일을 보내주세요.</label>
                        </div>
                        <button type="submit" className="bg-red-600 text-white py-2 px-4 rounded w-full">동의하고 계속</button>
                    </form>
                </div>
            </div>
        </NetflixLayout>
    );
};

export default Step2;
