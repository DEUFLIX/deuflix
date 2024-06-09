// pages/account/security.tsx
import React from 'react';
import Layout from '../../components/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt, faShieldAlt, faUser, faChevronRight, faArrowLeft, faHouse } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import styles from '../../styles/shared.module.css';

const Security = () => {
    const router = useRouter();
    const sidebarItems = [
        { text: '넷플릭스로 돌아가기', icon: faArrowLeft, link: '/login' },
        { text: '계정', icon: faHouse, link: 'account' },
        { text: '멤버십', icon: faExchangeAlt, link: '/account/membership' },
        { text: '보안', icon: faShieldAlt, link: '/account/security' },
    ];

    return (
        <Layout sidebarItems={sidebarItems}>
            <h1 className="text-3xl font-bold mb-8">보안</h1>
            <section className="mb-8 p-4 border rounded-lg bg-white">
                <h2 className="text-xl font-semibold mb-4">계정 정보</h2>
                <div className="p-4 border rounded-lg bg-gray-50 mb-4">
                    <p className="mb-2"><strong>비밀번호</strong></p>
                </div>
                <div className="p-4 border rounded-lg bg-gray-50 mb-4">
                    <p className="mb-2"><strong>이메일</strong></p>
                    <p className="text-red-500">wjyyjml@naver.com <span className="text-sm">(인증 필요)</span></p>
                </div>
                <div className="p-4 border rounded-lg bg-gray-50 mb-4">
                    <p className="mb-2"><strong>휴대폰</strong></p>
                    <p className="text-black">010-3845-8140</p>
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
