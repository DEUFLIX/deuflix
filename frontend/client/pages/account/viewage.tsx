import React from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/shared.module.css';

const Viewage = () => {
    const router = useRouter();

    return (
        <div className={styles.body}>
            <header className={styles.topBar}>
                <div className={styles.headerContent}>
                    <img
                        src="https://hanggubuket.s3.ap-northeast-2.amazonaws.com/DEUFLIX.png"
                        alt="Netflix Logo"
                        className={styles.logo}
                        onClick={() => router.push('/')}
                    />
                </div>
            </header>
            <div className={`${styles.container} flex justify-center items-center`}>
                <main className="flex-1 p-4 max-w-4xl">
                    <h1 className="text-3xl font-bold mb-8 text-center">시청 제한</h1>
                    <section className={`${styles.section} mb-8 p-4 border rounded-lg`}>
                        <h2 className="text-2xl font-semibold mb-4 text-center">임시 프로필의 관람등급</h2>
                        <p className="mb-4 text-center">
                            이 프로필에서는 모든 관람등급의 콘텐츠가 표시됩니다.
                        </p>
                        <div className="flex items-center mb-4 justify-center">
                            <input
                                type="range"
                                min="0"
                                max="4"
                                defaultValue="4"
                                className="flex-grow"
                            />
                        </div>
                        <div className="flex justify-between mb-4">
                            <span className={styles.ratingBox}>전체관람가</span>
                            <span className={styles.ratingBox}>7+</span>
                            <span className={styles.ratingBox}>12+</span>
                            <span className={styles.ratingBox}>16+</span>
                            <span className={styles.ratingBox}>18+</span>
                        </div>
                        <div className="flex justify-center">
                            <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                                저장
                            </button>
                            <button
                                className="bg-gray-300 text-black px-4 py-2 rounded"
                                onClick={() => router.push('settings')}
                            >
                                취소
                            </button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default Viewage;
