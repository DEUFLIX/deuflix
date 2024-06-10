import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import styles from '../../styles/shared.module.css';

const Password = () => {
    const router = useRouter();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handlePasswordChange = () => {
        if (newPassword !== confirmPassword) {
            alert('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
            return;
        }

        if (!newPassword || !currentPassword) {
            alert('비밀번호는 빈 칸일 수 없습니다.');
            return;
        }

        alert('비밀번호가 변경되었습니다.');
        router.push('/account/account');
    };

    return (
        <Layout sidebarItems={[]}>
            <div className="container mx-auto px-4 py-8 flex justify-center">
                <div className="max-w-md w-full bg-white p-8 border border-gray-300 rounded-lg shadow-md" style={{ marginLeft: '-300px' }}>
                    <h1 className={`${styles.text3xl} font-bold mb-8`}>비밀번호 변경</h1>
                    <form onSubmit={e => { e.preventDefault(); handlePasswordChange(); }}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="currentPassword">
                                기존 비밀번호
                            </label>
                            <input
                                id="currentPassword"
                                type="password"
                                value={currentPassword}
                                onChange={e => setCurrentPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
                                새 비밀번호
                            </label>
                            <input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                                새 비밀번호를 다시 입력하세요
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                                required
                            />
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
                                onClick={() => router.push('/account/account')}
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

export default Password;
