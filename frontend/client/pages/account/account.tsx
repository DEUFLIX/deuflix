// pages/account/account.tsx
import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faExchangeAlt, faShieldAlt, faUser, faCreditCard, faLock, faChild, faCog, faChevronRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import styles from '../../styles/shared.module.css';

const Account = () => {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const sidebarItems = [
        { text: '넷플릭스로 돌아가기', icon: faArrowLeft, link: '/login' },
        { text: '계정', icon: faHouse, link: '/account/account' },
        { text: '멤버십', icon: faExchangeAlt, link: '/account/membership' },
        { text: '보안', icon: faShieldAlt, link: '/account/security' },
    ];

    const handleSettingsClick = () => {
        router.push('/account/settings');
    };

    const handleMembershipClick = () => {
        router.push('/account/membership');
    };

    const handleViewAgeClick = () => {
        router.push('/account/viewage');
    };

    return (
        <Layout sidebarItems={sidebarItems}>
            <h1 className={`${styles.text3xl} font-bold mb-8`}>계정</h1>
            <section className={`${styles.accountOverview} mb-8 p-4 border rounded-lg`}>
                <h2 className={`${styles.accountOverviewH2} mb-4`}>멤버십 정보</h2>
                <p>멤버십 시작: 2023년 6월</p>
                <p>다음 결제일: 2024년 6월 4일</p>
                <p>계정: user@example.com</p>
                <button className="text-blue-500 hover:underline" onClick={handleMembershipClick}>멤버십 관리</button>
            </section>
            <section className={`${styles.quickLinks} p-4 border rounded-lg`}>
                <h2 className={`${styles.quickLinksH2} mb-4`}>빠른 링크</h2>
                <div className={`${styles.quickLinkItem} flex items-center justify-between cursor-pointer`} onClick={handleMembershipClick}>
                    <div className="flex items-center">
                        <FontAwesomeIcon icon={faExchangeAlt} className={`${styles.quickLinkItemI} mr-2`} />
                        <span className={`${styles.quickLinkItemSpan} ${styles.cursorPointer}`}>멤버십 변경</span>
                    </div>
                    <FontAwesomeIcon icon={faChevronRight} />
                </div>
                <div className={`${styles.quickLinkItem} flex items-center justify-between cursor-pointer`}>
                    <div className="flex items-center">
                        <FontAwesomeIcon icon={faCreditCard} className={`${styles.quickLinkItemI} mr-2`} />
                        <span className={`${styles.quickLinkItemSpan} ${styles.cursorPointer}`}>결제 수단 관리</span>
                    </div>
                    <FontAwesomeIcon icon={faChevronRight} />
                </div>
                <div className={`${styles.quickLinkItem} flex items-center justify-between cursor-pointer`}>
                    <div className="flex items-center">
                        <FontAwesomeIcon icon={faLock} className={`${styles.quickLinkItemI} mr-2`} />
                        <span className={`${styles.quickLinkItemSpan} ${styles.cursorPointer}`}>비밀번호 업데이트</span>
                    </div>
                    <FontAwesomeIcon icon={faChevronRight} />
                </div>
                <div className={`${styles.quickLinkItem} flex items-center justify-between cursor-pointer`} onClick={handleViewAgeClick}>
                    <div className="flex items-center">
                        <FontAwesomeIcon icon={faChild} className={`${styles.quickLinkItemI} mr-2`} />
                        <span className={`${styles.quickLinkItemSpan} ${styles.cursorPointer}`}>자녀 보호 설정 조정</span>
                    </div>
                    <FontAwesomeIcon icon={faChevronRight} />
                </div>
                <div className={`${styles.quickLinkItem} flex items-center justify-between cursor-pointer`} onClick={handleSettingsClick}>
                    <div className="flex items-center">
                        <FontAwesomeIcon icon={faCog} className={`${styles.quickLinkItemI} mr-2`} />
                        <span className={`${styles.quickLinkItemSpan} ${styles.cursorPointer}`}>설정 변경</span>
                    </div>
                    <FontAwesomeIcon icon={faChevronRight} />
                </div>
            </section>
            <section className={`${styles.profileManagement} p-6 border rounded-lg`}>
                <h2 className={`${styles.profileManagementH2} mb-4`}>프로필 관리</h2>
                <div className={`${styles.profileIcons} flex space-x-4`}>
                    <img src="https://hanggubuket.s3.ap-northeast-2.amazonaws.com/profile.png" alt="Profile 1" className={styles.profileIconsImg}/>
                    <img src="https://hanggubuket.s3.ap-northeast-2.amazonaws.com/profile.png" alt="Profile 2" className={styles.profileIconsImg}/>
                    <img src="https://hanggubuket.s3.ap-northeast-2.amazonaws.com/profile.png" alt="Profile 3" className={styles.profileIconsImg}/>
                </div>
            </section>
        </Layout>
    );
};

export default Account;
