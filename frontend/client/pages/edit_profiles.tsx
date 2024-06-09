// components/EditProfilePage.tsx

import axios from "axios";
import { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";
import Image from "next/image";

type Profile = {
    id: number;
    UId: number;
    pName: string;
    pImage: string | null; // 프로필 이미지 경로
    age: string;
    password: string; // DB의 비밀번호
};

interface EditProfilePageProps {
    profile: Profile;
}

const EditProfilePage: NextPage<EditProfilePageProps> = ({ profile }) => {
    const router = useRouter();
    const [pName, setPName] = useState("");
    const [pImage, setPImage] = useState("");
    const [age, setAge] = useState("");
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null); // 현재 비밀번호가 DB의 비밀번호와 일치하는지 여부

    const userState = useContext(UserContext);

    useEffect(() => {
        console.log("Profile data:", profile);
        if (profile) {
            setPName(profile.pName);
            setPImage(profile.pImage || "");
            setAge(profile.age);
        }
    }, [profile]);

    const checkCurrentPassword = (currentPassword: string) => {
        // DB의 비밀번호와 비교하여 일치 여부를 확인
        const match = currentPassword === profile.password;
        setPasswordMatch(match);
    };

    const handleUpdateProfile = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        if (!profile.id) {
            toast.error("Invalid profile ID");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        // Check if current password matches
        checkCurrentPassword(password);
        if (!passwordMatch) {
            toast.error("Current password does not match");
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
                    password: newPassword, // 신규 비밀번호로 업데이트
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
            <Image
                src="https://assets.nflxext.com/ffe/siteui/vlv3/79fe83d4-7ef6-4181-9439-46db72599559/bd4f2024-8853-47ee-b84b-779b52fd5f12/TR-tr-20221017-popsignuptwoweeks-perspective_alpha_website_small.jpg"
                className="-z-10 opacity-30 sm:!inline h-screen w-screen"
                layout="fill"
                objectFit="cover"
            />
            <div>
                <img
                    src="https://hanggubuket.s3.ap-northeast-2.amazonaws.com/DEUFLIX.png"
                    className="absolute left-4 top-4 cursor-pointer object-contain md:left-10 md:top-6"
                    width={150}
                    height={150}
                />
            </div>
            <form
                onSubmit={handleUpdateProfile}
                className="relative mt-20 space-y-8 rounded bg-black/75 py-10 px-6 md:mt-0 md:max-w-md md:px-14"
            >
                <h1 className="text-4xl font-semibold dev">프로필 수정</h1>
                <div className="space-y-4">
                    <label className="block text-white">
                        Profile Name
                        <input
                            type="text"
                            className="mt-1 block w-full rounded bg-gray-900 text-white px-3 py-2"
                            value={pName}
                            placeholder={profile.pName}
                            onChange={(e) => setPName(e.target.value)}
                            required
                        />
                    </label>
                    <label className="block text-white">
                        Profile Image URL
                        <input
                            type="text"
                            className="mt-1 block w-full rounded bg-gray-900 text-white px-3 py-2"
                            value={pImage}
                            placeholder={profile.pImage || ""}
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
                    <label className="block text-white">
                        Current Password
                        <input
                            type="password"
                            className="mt-1 block w-full rounded bg-gray-900 text-white px-3 py-2"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                checkCurrentPassword(e.target.value);
                            }}
                            required
                        />
                        {passwordMatch !== null && (
                            <p className={`text-sm ${passwordMatch ? "text-green-500" : "text-red-500"}`}>
                                {passwordMatch ? "Current password matches" : "Current password does not match"}
                            </p>
                        )}
                    </label>
                    <label className="block text-white">
                        New Password
                        <input
                            type="password"
                            className="mt-1 block w-full rounded bg-gray-900 text-white px-3 py-2"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </label>
                    <label className="block text-white">
                        Confirm New Password
                        <input
                            type="password"
                            className="mt-1 block w-full rounded bg-gray-900 text-white px-3 py-2"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
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

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    try {
        const profileId = query.profileId as string;
        if (!profileId) {
            return {
                notFound: true,
            };
        }

        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API}/profiles/profile/${profileId}`);
        if (!data || !data.id) {
            return {
                notFound: true,
            };
        }

        // 데이터에서 ppw를 password로 변경
        const profile: Profile = {
            id: data.id,
            UId: data.uid,
            pName: data.pname,
            pImage: data.pimage,
            age: data.age,
            password: data.ppw,
        };

        return {
            props: {
                profile,
            },
        };
    } catch (error) {
        console.error("Failed to fetch profile:", error);
        return {
            props: {
                profile: null,
            },
        };
    }
};

export default EditProfilePage;
