import React from 'react';
import Layout from '../../components/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faUser, faChevronRight, faLock, faShieldAlt, faHistory, faTrashAlt, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import styles from '../../styles/shared.module.css';

const Settings = () => {
    const router = useRouter();
    const { userId, profileId } = router.query;  // 현재 URL에서 쿼리 파라미터 추출

    const sidebarItems = [
        { text: '이전 페이지', icon: faArrowLeft, link: '/account/account' },
    ];

    const handleProfileLockClick = () => {
        router.push('/account/profilelock');
    };

    const handleViewingRestrictionsClick = () => {
        // 시청 제한 페이지로 이동할 때 userId와 profileId를 쿼리 파라미터로 전달
        router.push(`/account/viewage?userId=${userId}&profileId=${profileId}`);
    };

    const handleProfileDeleteClick = () => {
        // 프로필 삭제 페이지로 이동할 때 userId와 profileId를 쿼리 파라미터로 전달
        router.push(`/account/profiledel?userId=${userId}&profileId=${profileId}`);
    };

    return (
        <Layout sidebarItems={sidebarItems}>
            <h1 className={`${styles.text3xl} font-bold mb-8`}>프로필 설정</h1>
            <section className={`${styles.accountOverview} mb-8 p-4 border rounded-lg`}>
                <h2 className={`${styles.accountOverviewH2} mb-4`}>설정</h2>
                <div className={`${styles.quickLinkItem} flex items-center justify-between cursor-pointer`} onClick={handleProfileLockClick}>
                    <div className="flex items-center">
                        <FontAwesomeIcon icon={faLock} className={`${styles.quickLinkItemI} mr-2`} />
                        <span className={styles.quickLinkItemSpan}>프로필 잠금</span>
                    </div>
                    <FontAwesomeIcon icon={faChevronRight} />
                </div>
                <div className={`${styles.quickLinkItem} flex items-center justify-between cursor-pointer`} onClick={handleViewingRestrictionsClick}>
                    <div className="flex items-center">
                        <FontAwesomeIcon icon={faShieldAlt} className={`${styles.quickLinkItemI} mr-2`} />
                        <span className={styles.quickLinkItemSpan}>시청 제한</span>
                    </div>
                    <FontAwesomeIcon icon={faChevronRight} />
                </div>
                <div className={`${styles.quickLinkItem} flex items-center justify-between cursor-pointer`}>
                    <div className="flex items-center">
                        <FontAwesomeIcon icon={faHistory} className={`${styles.quickLinkItemI} mr-2`} />
                        <span className={styles.quickLinkItemSpan}>시청 기록</span>
                    </div>
                    <FontAwesomeIcon icon={faChevronRight} />
                </div>
                <div className={`${styles.quickLinkItem} flex items-center justify-between cursor-pointer`} onClick={handleProfileDeleteClick}>
                    <div className="flex items-center">
                        <FontAwesomeIcon icon={faTrashAlt} className={`${styles.quickLinkItemI} mr-2`} />
                        <span className={styles.quickLinkItemSpan}>프로필 삭제</span>
                    </div>
                    <FontAwesomeIcon icon={faChevronRight} />
                </div>
            </section>
        </Layout>
    );
};

export default Settings;
