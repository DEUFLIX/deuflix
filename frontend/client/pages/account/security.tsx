import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt, faShieldAlt, faHouse, faLock, faChevronRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from '../../styles/shared.module.css';

const Security = () => {
    const router = useRouter();
    const { userId } = router.query;
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        const fetchEmail = async () => {
            if (userId) {
                try {
                    console.log('Fetching email for userId:', userId);
                    const response = await axios.get(`http://localhost:8080/api/v1/users/${userId}/email`);
                    console.log('Email response:', response);
                    setEmail(response.data);
                } catch (error) {
                    console.error('Failed to fetch email:', error);
                }
            }
        };

        fetchEmail();
    }, [userId]);

    const sidebarItems = [
        { text: '넷플릭스로 돌아가기', icon: faArrowLeft, link: '/' },
        { text: '계정', icon: faHouse, link: `/account/account?userId=${userId}` },
        { text: '멤버십', icon: faExchangeAlt, link: `/account/membership?userId=${userId}` },
        { text: '보안', icon: faShieldAlt, link: `/account/security?userId=${userId}` },
    ];

    const handlePasswordClick = () => {
        router.push(`/account/password?userId=${userId}`);
    };

    return (
        <Layout sidebarItems={sidebarItems}>
            <h1 className="text-3xl font-bold mb-8">보안</h1>
            <section className="mb-8 p-4 border rounded-lg bg-white">
                <h2 className="text-xl font-semibold mb-4">계정 정보</h2>
                <div
                    className="p-4 border rounded-lg bg-gray-50 mb-4 w-full text-left cursor-pointer flex items-center justify-between"
                    onClick={handlePasswordClick}
                >
                    <div className="flex items-center">
                        <FontAwesomeIcon icon={faLock} className="mr-2" />
                        <span>비밀번호 업데이트</span>
                    </div>
                    <FontAwesomeIcon icon={faChevronRight} />
                </div>
                <div className="p-4 border rounded-lg bg-gray-50 mb-4">
                    <p className="mb-2"><strong>이메일</strong></p>
                    <p>{email}</p>
                </div>
            </section>
            <section className="mb-8 p-4 border rounded-lg bg-white">
                <h2 className="text-xl font-semibold mb-4">액세스 및 개인정보</h2>
                <div className="p-4 border rounded-lg bg-gray-50 mb-4">
                    <p className="mb-2"><strong>액세스 및 디바이스</strong></p>
                    <p className="text-sm text-gray-600">로그인된 디바이스 관리</p>
                </div>
                <div className="p-4 border rounded-lg bg-gray-50 mb-4">
                    <p className="mb-2"><strong>프로필 이전</strong></p>
                    <p className="text-sm text-gray-600">기기</p>
                </div>
                <div className="p-4 border rounded-lg bg-gray-50 mb-4">
                    <p className="mb-2"><strong>개인 정보 액세스</strong></p>
                    <p className="text-sm text-gray-600">개인 정보 사본 요청</p>
                </div>
                <div className="p-4 border rounded-lg bg-gray-50">
                    <p className="mb-2"><strong>기능 테스트</strong></p>
                    <p className="text-sm text-gray-600">계정</p>
                </div>
            </section>
            <div className="p-4 border rounded-lg bg-white">
                <button className="text-red-500 hover:underline">계정 삭제</button>
            </div>
        </Layout>
    );
};

export default Security;
