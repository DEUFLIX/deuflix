// pages/account/membership.tsx
import React from 'react';
import Layout from '../../components/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt, faShieldAlt, faUser, faChevronRight, faArrowLeft, faHouse } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import styles from '../../styles/shared.module.css';

const Membership = () => {
    const router = useRouter();
    const sidebarItems = [
        { text: '넷플릭스로 돌아가기', icon: faArrowLeft, link: '/login' },
        { text: '계정', icon: faHouse, link: '/account/account' },
        { text: '멤버십', icon: faExchangeAlt, link: '/account/membership' },
        { text: '보안', icon: faShieldAlt, link: '/account/security' },
        { text: '프로필', icon: faUser, link: '/account/profile' },
    ];

    return (
        <Layout sidebarItems={sidebarItems}>
            <h1 className="text-3xl font-bold mb-8">멤버십</h1>
            <section className="mb-8 p-4 border rounded-lg bg-white">
                <h2 className="text-xl font-semibold mb-4">멤버십 상세 정보</h2>
                <div className="p-4 border rounded-lg bg-gray-50">
                    <h3 className="font-bold mb-2">광고형 스탠다드 멤버십</h3>
                    <p className="mb-4">1080p 영상 해상도, 다양한 디바이스에서 시청, 제한된 수의 중간 광고.</p>
                    <button className="text-blue-500 hover:underline">멤버십 변경</button>
                </div>
            </section>
            <section className="mb-8 p-4 border rounded-lg bg-white">
                <h2 className="text-xl font-semibold mb-4">결제 정보</h2>
                <div className="p-4 border rounded-lg bg-gray-50 mb-4">
                    <p className="mb-2">다음 결제일: 2024년 6월 20일</p>
                    <p className="mb-2">계정: user@example.com</p>
                    <p className="mb-2">LG U+ •••• •••• •8140</p>
                </div>
                <div className="p-4 border rounded-lg bg-gray-50 mb-4">
                    <button className="text-blue-500 hover:underline">결제 수단 관리</button>
                </div>
                <div className="p-4 border rounded-lg bg-gray-50 mb-4">
                    <button className="text-blue-500 hover:underline">기프트 또는 프로모션 코드 사용</button>
                </div>
                <div className="p-4 border rounded-lg bg-gray-50">
                    <button className="text-blue-500 hover:underline">결제 내역 확인</button>
                </div>
            </section>
            <div className="p-4 border rounded-lg bg-white">
                <button className="text-red-500 hover:underline">멤버십 해지</button>
            </div>
        </Layout>
    );
};

export default Membership;
