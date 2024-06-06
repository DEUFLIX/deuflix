import React, { ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/shared.module.css';

interface LayoutProps {
    children: ReactNode;
    sidebarItems: Array<{ text: string; icon: IconProp; link: string }>;
}

const Layout: React.FC<LayoutProps> = ({ children, sidebarItems }) => {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleBackToNetflix = () => {
        router.push('/login'); // 로그인 페이지로 이동
    };

    const handleLogoClick = () => {
        router.push('/login'); // 로그인 페이지로 이동
    };

    return (
        <div className={styles.body}>
            <header className={styles.topBar}>
                <div className={styles.headerContent}>
                    <img
                        src="https://hanggubuket.s3.ap-northeast-2.amazonaws.com/DEUFLIX.png"
                        alt="Netflix Logo"
                        className={styles.logo}
                        onClick={handleLogoClick}
                        style={{ cursor: 'pointer' }}
                    />
                    <div className={`${styles.profileMenu} relative`}>
                        <button className="text-lg flex items-center">
                            <img src="https://hanggubuket.s3.ap-northeast-2.amazonaws.com/profile.png" alt="Profile Icon" className={`h-8 w-8 rounded-full mr-2 ${styles.profileMenuImg}`} />
                            <i className="fas fa-caret-down"></i>
                        </button>
                        <div className={`${styles.profileMenuAbsolute} absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg hidden`}>
                            <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">계정</a>
                            <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">로그아웃</a>
                        </div>
                    </div>
                </div>
            </header>
            <div className={`${styles.container} flex`}>
                <aside className={`${styles.sidebar} mt-16`}>

                    <ul className="space-y-4">
                        {sidebarItems.map((item, index) => (
                            <li key={index} className={`${styles.sidebarLi} flex items-center`}>
                                <FontAwesomeIcon icon={item.icon} className={`${styles.sidebarI} mr-2`} />
                                <a href={item.link} className="text-lg text-black">{item.text}</a>
                            </li>
                        ))}
                    </ul>
                </aside>
                <main className="flex-1 p-8 ml-4">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
