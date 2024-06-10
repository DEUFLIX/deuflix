import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faExchangeAlt, faShieldAlt, faCreditCard, faLock, faChild, faCog, faChevronRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from '../../styles/shared.module.css';

interface Profile {
    id: number;
    pname: string;
    pimage: string;
    // 다른 필요한 속성들 추가
}

const Account = () => {
    const router = useRouter();
    const { userId, profileId } = router.query;
    const [email, setEmail] = useState<string | null>(null);
    const [profiles, setProfiles] = useState<Profile[]>([]);

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

        const fetchProfiles = async () => {
            if (userId) {
                try {
                    console.log('Fetching profiles for userId:', userId);
                    const response = await axios.get(`http://localhost:8080/api/v1/profiles/user/${userId}`);
                    console.log('Profiles response:', response);
                    setProfiles(response.data);
                } catch (error) {
                    console.error('Failed to fetch profiles:', error);
                }
            }
        };

        fetchEmail();
        fetchProfiles();
    }, [userId]);

    const sidebarItems = [
        { text: '넷플릭스로 돌아가기', icon: faArrowLeft, link: '/' },
        { text: '계정', icon: faHouse, link: '/account/account' },
        { text: '멤버십', icon: faExchangeAlt, link: '/account/membership' },
        { text: '보안', icon: faShieldAlt, link: '/account/security' },
    ];

    const handleNavigation = (link: string) => {
        router.push({
            pathname: link,
            query: { userId, profileId }
        });
    };

    const handleProfileClick = (profileId: number) => {
        router.push({
            pathname: '/edit_profiles',
            query: { profileId }
        });
    };

    return (
        <Layout sidebarItems={sidebarItems.map(item => ({ ...item, link: `${item.link}` }))}>
            <h1 className={`${styles.text3xl} font-bold mb-8`}>계정</h1>
            <section className={`${styles.accountOverview} mb-8 p-4 border rounded-lg`}>
                <h2 className={`${styles.accountOverviewH2} mb-4`}>멤버십 정보</h2>
                <p>멤버십 시작: 2023년 6월</p>
                <p>다음 결제일: 2024년 6월 4일</p>
                <p>계정: {email}</p>
                <button className="text-blue-500 hover:underline" onClick={() => handleNavigation('/account/membership')}>멤버십 관리</button>
            </section>
            <section className={`${styles.quickLinks} p-4 border rounded-lg`}>
                <h2 className={`${styles.quickLinksH2} mb-4`}>빠른 링크</h2>
                <div className={`${styles.quickLinkItem} flex items-center justify-between cursor-pointer`}
                     onClick={() => handleNavigation('/account/membership')}>
                    <div className="flex items-center">
                        <FontAwesomeIcon icon={faExchangeAlt} className={`${styles.quickLinkItemI} mr-2`}/>
                        <span className={`${styles.quickLinkItemSpan} ${styles.cursorPointer}`}>멤버십 변경</span>
                    </div>
                    <FontAwesomeIcon icon={faChevronRight}/>
                </div>
                <div className={`${styles.quickLinkItem} flex items-center justify-between cursor-pointer`}>
                    <div className="flex items-center">
                        <FontAwesomeIcon icon={faCreditCard} className={`${styles.quickLinkItemI} mr-2`}/>
                        <span className={`${styles.quickLinkItemSpan} ${styles.cursorPointer}`}>결제 수단 관리</span>
                    </div>
                    <FontAwesomeIcon icon={faChevronRight}/>
                </div>
                <div className={`${styles.quickLinkItem} flex items-center justify-between cursor-pointer`}
                     onClick={() => handleNavigation('/account/password')}>
                    <div className="flex items-center">
                        <FontAwesomeIcon icon={faLock} className={`${styles.quickLinkItemI} mr-2`}/>
                        <span className={`${styles.quickLinkItemSpan} ${styles.cursorPointer}`}>비밀번호 업데이트</span>
                    </div>
                    <FontAwesomeIcon icon={faChevronRight}/>
                </div>

                <div className={`${styles.quickLinkItem} flex items-center justify-between cursor-pointer`}
                     onClick={() => handleNavigation('/account/viewage')}>
                    <div className="flex items-center">
                        <FontAwesomeIcon icon={faChild} className={`${styles.quickLinkItemI} mr-2`}/>
                        <span className={`${styles.quickLinkItemSpan} ${styles.cursorPointer}`}>자녀 보호 설정 조정</span>
                    </div>
                    <FontAwesomeIcon icon={faChevronRight}/>
                </div>
                <div className={`${styles.quickLinkItem} flex items-center justify-between cursor-pointer`}
                     onClick={() => handleNavigation('/account/settings')}>
                    <div className="flex items-center">
                        <FontAwesomeIcon icon={faCog} className={`${styles.quickLinkItemI} mr-2`}/>
                        <span className={`${styles.quickLinkItemSpan} ${styles.cursorPointer}`}>설정 변경</span>
                    </div>
                    <FontAwesomeIcon icon={faChevronRight}/>
                </div>
            </section>
            <section className={`${styles.profileManagement} p-6 border rounded-lg`}>
                <h2 className={`${styles.profileManagementH2} mb-4`}>프로필 관리</h2>
                <div className={`${styles.profileIcons} flex space-x-4`}>
                    {profiles.map(profile => (
                        <div key={profile.id} className="text-center cursor-pointer"
                             onClick={() => handleProfileClick(profile.id)}>
                            <img src={profile.pimage} alt={profile.pname} className={styles.profileIconsImg} />
                            <p>{profile.pname}</p>
                        </div>
                    ))}
                </div>
            </section>
        </Layout>
    );
};

export default Account;
