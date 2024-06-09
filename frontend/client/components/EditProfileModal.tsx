// components/EditProfileModal.tsx

import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

type Profile = {
    id: number;
    UId: number;
    pname: string;
    pImage: string | null; // 프로필 이미지 경로
};

interface EditProfileModalProps {
    profile: Profile;
    onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ profile, onClose }) => {
    const [newProfileName, setNewProfileName] = useState(profile.pname || "");

    const handleSaveProfile = async () => {
        try {
            const updatedProfile = { ...profile, pname: newProfileName };
            await axios.put(`${process.env.NEXT_PUBLIC_API}/profiles/${profile.id}`, updatedProfile);
            toast.success("프로필이 성공적으로 업데이트되었습니다.");
            onClose();
        } catch (error) {
            console.error("Failed to update profile:", error);
            toast.error("프로필 업데이트에 실패했습니다.");
        }
    };

    const handleDeleteProfile = async () => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API}/profiles/${profile.id}`);
            toast.success("프로필이 성공적으로 삭제되었습니다.");
            onClose();
        } catch (error) {
            console.error("Failed to delete profile:", error);
            toast.error("프로필 삭제에 실패했습니다.");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
            <div className="bg-white p-8 rounded-lg w-full sm:w-96">
                <h2 className="text-2xl font-semibold mb-4">프로필 편집</h2>
                <div className="mb-4">
                    <label htmlFor="profileName" className="block text-sm font-medium text-gray-700">프로필 이름</label>
                    <input
                        id="profileName"
                        type="text"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        value={newProfileName}
                        onChange={(e) => setNewProfileName(e.target.value)}
                    />
                </div>
                <div className="flex justify-between">
                    <button
                        onClick={handleSaveProfile}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                    >
                        저장
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none focus:bg-gray-400"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleDeleteProfile}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:bg-red-600"
                    >
                        삭제
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProfileModal;
