import React, { useState, useEffect } from 'react';
import axios from 'axios';

type ProfileEditModalProps = {
    profile: Profile | null;
    onClose: () => void;
    onUpdate: () => void;
};

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ profile, onClose, onUpdate }) => {
    const [pName, setPName] = useState(profile?.pname || '');
    const [pImage, setPImage] = useState(profile?.pImage || '');
    const [age, setAge] = useState(profile?.age || '');

    const handleSave = async () => {
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API}/profiles/${profile?.id}`, {
                pName,
                pImage,
                age
            });
            onUpdate();
            onClose();
        } catch (error) {
            console.error("Failed to update profile:", error);
        }
    };

    useEffect(() => {
        if (profile) {
            setPName(profile.pname);
            setPImage(profile.pImage);
            setAge(profile.age);
        }
    }, [profile]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-xl mb-4">프로필 수정</h2>
                <label className="block mb-2">
                    이름:
                    <input
                        type="text"
                        value={pName}
                        onChange={(e) => setPName(e.target.value)}
                        className="w-full mt-1 p-2 border rounded"
                    />
                </label>
                <label className="block mb-2">
                    이미지 URL:
                    <input
                        type="text"
                        value={pImage}
                        onChange={(e) => setPImage(e.target.value)}
                        className="w-full mt-1 p-2 border rounded"
                    />
                </label>
                <label className="block mb-2">
                    나이:
                    <select
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full mt-1 p-2 border rounded"
                    >
                        <option value="all">All</option>
                        <option value="12">12</option>
                        <option value="15">15</option>
                        <option value="18">18</option>
                    </select>
                </label>
                <div className="flex justify-end mt-4">
                    <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">취소</button>
                    <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">저장</button>
                </div>
            </div>
        </div>
    );
};

export default ProfileEditModal;
