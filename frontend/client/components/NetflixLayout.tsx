import React, { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

interface NetflixLayoutProps {
    children: ReactNode;
}

const NetflixLayout: React.FC<NetflixLayoutProps> = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const auth = localStorage.getItem('auth');
        if (auth) {
            setLoggedIn(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('auth');
        setLoggedIn(false);
        router.push('/login'); // 로그아웃 후 login 페이지로 이동
    };

    return (
        <div className="min-h-screen bg-white">
            <header className="bg-white border-b border-gray-200 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <Link href="http://localhost:3000/">
                        <a>
                            <Image src="/netflix-logo.png" alt="Netflix Logo" width={100} height={30} />
                        </a>
                    </Link>
                    {loggedIn ? (
                        <button onClick={handleLogout} className="text-black hover:underline">
                            로그아웃
                        </button>
                    ) : (
                        <Link href="/login">
                            <a className="text-black hover:underline">로그인</a>
                        </Link>
                    )}
                </div>
            </header>
            <main className="container mx-auto p-4">{children}</main>
            <footer className="bg-gray-100 border-t border-gray-200 p-4 mt-4">
                <div className="container mx-auto text-sm text-gray-500">
                    <p>질문이 있으신가요? 문의 전화: 00-308-321-0161 (수신자 부담)</p>
                    <ul className="flex space-x-4">
                        <li>자주 묻는 질문</li>
                        <li>고객 센터</li>
                        <li>넷플릭스 스토리</li>
                        <li>이용 약관</li>
                        <li>개인정보 처리방침</li>
                        <li>쿠키 설정</li>
                        <li>회사 정보</li>
                    </ul>
                </div>
            </footer>
        </div>
    );
};

export default NetflixLayout;
