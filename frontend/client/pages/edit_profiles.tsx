import axios from "axios";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";

type Profile = {
    id: number;
    UId: number;
    pname: string;
    pImage: string | null; // 프로필 이미지 경로
    age: string;
};

interface EditProfilePageProps {
    profile: Profile;
}

const EditProfilePage: NextPage<EditProfilePageProps> = ({ profile }) => {
    const router = useRouter();
    const [pName, setPName] = useState("");
    const [pImage, setPImage] = useState("");
    const [age, setAge] = useState("");
    const userState = useContext(UserContext);

    useEffect(() => {
        console.log("Profile data:", profile);
        if (profile) {
            setPName(profile.pname);
            setPImage(profile.pImage || "");
            setAge(profile.age);
        }
    }, [profile]);

    const handleUpdateProfile = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        if (!profile.id) {
            toast.error("Invalid profile ID");
            return;
        }

        try {
            const { data } = await axios.put(
                `${process.env.NEXT_PUBLIC_API}/profiles/update/${profile.id}`,
                {
                    id: profile.id,
                    pName: pName,
                    pImage: pImage,
                    age: age,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                }
            );
            toast.success("Profile updated successfully");
            router.push(`/profiles?userId=${userState?.state?.id}`);
        } catch (error) {
            toast.error("Failed to update profile");
            console.error("Error updating profile:", error);
        }
    };

    if (!profile) {
        // 프로필 데이터가 없는 경우
        return (
            <div>
                <p>프로필을 찾을 수 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="relative flex h-screen w-screen flex-col md:items-center md:justify-center md:bg-transparent" style={{ userSelect: 'none' }}>
            <Head>
                <title>Edit Profile</title>
            </Head>

            <form
                onSubmit={handleUpdateProfile}
                className="relative mt-20 space-y-8 rounded bg-black/75 py-10 px-6 md:mt-0 md:max-w-md md:px-14"
            >
                <h1 className="text-4xl font-semibold dev">Edit Profile</h1>
                <div className="space-y-4">
                    <label className="block text-white">
                        Profile Name
                        <input
                            type="text"
                            className="mt-1 block w-full rounded bg-gray-900 text-white px-3 py-2"
                            value={pName} // 수정된 부분
                            placeholder={profile.pname}
                            onChange={(e) => setPName(e.target.value)}
                            required
                        />
                    </label>
                    <label className="block text-white">
                        Profile Image URL
                        <input
                            type="text"
                            className="mt-1 block w-full rounded bg-gray-900 text-white px-3 py-2"
                            value={pImage} // 수정된 부분
                            placeholder={profile.pimage}
                            onChange={(e) => setPImage(e.target.value)}
                        />
                    </label>
                    <label className="block text-white">
                        Age
                        <select
                            className="mt-1 block w-full rounded bg-gray-900 text-white px-3 py-2"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            required
                        >
                            <option value="ALL">ALL</option>
                            <option value="12">12</option>
                            <option value="15">15</option>
                            <option value="18">18</option>
                        </select>
                    </label>
                </div>
                <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded mt-4"
                >
                    Update Profile
                </button>
            </form>
        </div>
    );
};

export default EditProfilePage;
