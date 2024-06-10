import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import styles from '../../styles/shared.module.css';

const ProfileLock = () => {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [isLocked, setIsLocked] = useState(false);

    const handleLockChange = () => {
        alert('프로필 잠금 설정이 변경되었습니다.');
        router.push('/account/account');
    };

    return (
        <Layout sidebarItems={[]}>
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-md mx-auto bg-white p-8 border border-gray-300 rounded-lg shadow-md" style={{ transform: 'translateX(-125px)' }}>
                    <h1 className={`${styles.text3xl} font-bold mb-4`}>프로필 잠금</h1>
                    <p className="mb-4">프로필의 비밀번호를 설정하세요.</p>
                    <form onSubmit={e => { e.preventDefault(); handleLockChange(); }}>
                        <div className="mb-4">
                            <input
                                id="password"
                                type="password"
                                placeholder="비밀번호를 입력하세요"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    checked={isLocked}
                                    onChange={e => setIsLocked(e.target.checked)}
                                    className="form-checkbox"
                                />
                                <span className="ml-2">프로필 잠금 설정</span>
                            </label>
                        </div>
                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                저장
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push('/account/settings')}
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                            >
                                취소
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default ProfileLock;
