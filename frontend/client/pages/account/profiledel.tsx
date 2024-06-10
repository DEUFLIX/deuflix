import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Layout from '../../components/Layout';
import styles from '../../styles/shared.module.css';

const ProfileDel = () => {
    const router = useRouter();
    const { userId, profileId } = router.query;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDeleteProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.delete(`http://localhost:8080/api/v1/profiles/profile/${profileId}`);
            if (response.status === 204) {  // 204 No Content
                alert('프로필이 삭제되었습니다.');
                router.push(`/profiles?userId=${userId}`);
            } else {
                throw new Error('Failed to delete profile');
            }
        } catch (err) {
            // @ts-ignore
            setError('프로필 삭제에 실패했습니다.');
            setLoading(false);
        }
    };

    return (
        <Layout sidebarItems={[]}>
            <div className="container mx-auto px-4 py-8 flex justify-center">
                <div className="max-w-md w-full bg-white p-8 border border-gray-300 rounded-lg shadow-md" style={{ marginLeft: '-300px' }}>
                    <h1 className={`${styles.text3xl} font-bold mb-8`}>프로필 삭제</h1>
                    <p className="mb-4">정말로 이 프로필을 삭제하시겠습니까?</p>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handleDeleteProfile}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            disabled={loading}
                        >
                            {loading ? '삭제 중...' : '삭제'}
                        </button>
                        <button
                            onClick={() => router.push(`/account/account?userId=${userId}&profileId=${profileId}`)}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                        >
                            취소
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ProfileDel;
