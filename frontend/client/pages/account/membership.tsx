import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt, faShieldAlt, faUser, faChevronRight, faArrowLeft, faHouse } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from '../../styles/shared.module.css';

const Membership = () => {
    const router = useRouter();
    const { userId, profileId } = router.query;
    const [email, setEmail] = useState<string | null>(null);
    const [membershipType, setMembershipType] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);

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

        const fetchMembershipDetails = async () => {
            if (userId) {
                try {
                    console.log('Fetching membership details for userId:', userId);
                    const response = await axios.get(`http://localhost:8080/api/v1/memberships/user/${userId}`);
                    console.log('Membership response:', response);
                    setMembershipType(response.data.membershipType);
                    setStartDate(response.data.startDate);
                    setEndDate(response.data.endDate);
                } catch (error) {
                    console.error('Failed to fetch membership details:', error);
                }
            }
        };

        fetchEmail();
        fetchMembershipDetails();
    }, [userId]);

    const sidebarItems = [
        { text: '넷플릭스로 돌아가기', icon: faArrowLeft, link: '/' },
        { text: '계정', icon: faHouse, link: `/account/account?userId=${userId}&profileId=${profileId}` },
        { text: '멤버십', icon: faExchangeAlt, link: `/account/membership?userId=${userId}&profileId=${profileId}` },
        { text: '보안', icon: faShieldAlt, link: `/account/security?userId=${userId}&profileId=${profileId}` },
    ];

    const handleMembershipChange = () => {
        router.push(`/Step4?userId=${userId}&profileId=${profileId}`);
    };

    return (
        <Layout sidebarItems={sidebarItems}>
            <h1 className="text-3xl font-bold mb-8">멤버십</h1>
            <section className="mb-8 p-4 border rounded-lg bg-white">
                <h2 className="text-xl font-semibold mb-4">멤버십 상세 정보</h2>
                <div className="p-4 border rounded-lg bg-gray-50">
                    <h3 className="font-bold mb-2">
                        {membershipType || 'loading...'} ({startDate ? new Date(startDate).toLocaleDateString() : 'loading...'})
                    </h3>
                    <p className="mb-4">1080p 영상 해상도, 다양한 디바이스에서 시청, 제한된 수의 중간 광고.</p>
                    <button className="text-blue-500 hover:underline" onClick={handleMembershipChange}>멤버십 변경</button>
                </div>
            </section>
            <section className="mb-8 p-4 border rounded-lg bg-white">
                <h2 className="text-xl font-semibold mb-4">결제 정보</h2>
                <div className="p-4 border rounded-lg bg-gray-50 mb-4">
                    <p className="mb-2">다음 결제일: {endDate ? new Date(endDate).toLocaleDateString() : 'loading...'}</p>
                    <p className="mb-2">계정: {email || 'loading...'}</p>
                    <p className="mb-2">LG U+ •••• •••• 8140</p>
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
