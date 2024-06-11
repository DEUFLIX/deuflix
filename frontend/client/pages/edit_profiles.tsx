//edit_profiles.tsx
import axios from "axios";
import { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";
import AWS from "aws-sdk";

const AWS_ACCESS_KEY_ID = "AKIA6ODU2RE7DOSJZJHM" || "";
const AWS_SECRET_ACCESS_KEY = "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" || "";
const AWS_REGION = "ap-northeast-2" || "";
const AWS_BUCKET_NAME = "hanggubuket" || "";

type Profile = {
    id: number;
    UId: number;
    pName: string;
    pImage: string | null;
    age: string;
    pPw: string;
};

interface EditProfilePageProps {
    profile: Profile;
}

const EditProfilePage: NextPage<EditProfilePageProps> = ({ profile }) => {
    const router = useRouter();
    const [pName, setPName] = useState("");
    const [pImage, setPImage] = useState<string | ArrayBuffer | null>(null);
    const [age, setAge] = useState("");
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);
    const [passwordError, setPasswordError] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);

    const userState = useContext(UserContext);

    const s3 = new AWS.S3({
        accessKeyId: "AKIA6ODU2RE7DOSJZJHM",
        secretAccessKey: "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",
        region: "ap-northeast-2",
    });

    console.log("AWS_BUCKET_NAME:", AWS_BUCKET_NAME); // 버킷 이름을 확인하기 위한 로그

    useEffect(() => {
        if (profile) {
            setPName(profile.pName);
            setPImage(profile.pImage || "");
            setAge(profile.age);
        }
    }, [profile]);

    const checkCurrentPassword = (currentPassword: string) => {
        const match = currentPassword === profile.pPw;
        setPasswordMatch(match);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFile(file);

            const reader = new FileReader();
            reader.onload = () => {
                setPImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImage = async (file: File): Promise<AWS.S3.ManagedUpload.SendData> => {
        const params: AWS.S3.PutObjectRequest = {
            Bucket: AWS_BUCKET_NAME,
            Key: `profile-images/${Date.now()}_${Math.random()}.jpg`,
            Body: file,
            ContentType: file.type,
        };
        return s3.upload(params).promise();
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

        let pImageUrl = profile.pImage;
        if (file) {
            try {
                const imageData = await uploadImage(file);
                pImageUrl = imageData.Location;
            } catch (error) {
                toast.error("Failed to upload image");
                console.error("Error uploading image:", error);
                return;
            }
        }

        try {
            await axios.put(
                `${process.env.NEXT_PUBLIC_API}/v1/profiles/update/${profile.id}`,
                {
                    id: profile.id,
                    pName: pName,
                    pImage: pImageUrl,
                    age: age,
                    pPw: newPassword,
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

    const handleDeleteProfile = async () => {
        if (!profile.id) {
            toast.error("Invalid profile ID");
            return;
        }

        try {
            await axios.delete(
                `${process.env.NEXT_PUBLIC_API}/v1/profiles/profile/${profile.id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                }
            );
            toast.success("Profile deleted successfully");
            router.push(`/profiles?userId=${userState?.state?.id}`);
        } catch (error) {
            toast.error("Failed to delete profile");
            console.error("Error deleting profile:", error);
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewPassword(value);
        if (confirmPassword && value !== confirmPassword) {
            setPasswordError("Passwords do not match");
        } else {
            setPasswordError("");
        }
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setConfirmPassword(value);
        if (newPassword !== value) {
            setPasswordError("Passwords do not match");
        } else {
            setPasswordError("");
        }
    };

    if (!profile) {
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
                <h1 className="text-4xl font-semibold">프로필 수정</h1>
                <div className="space-y-4">
                    <label className="block text-white">
                        프로필 이름
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
                        프로필 이미지 (선택사항)
                        <input
                            type="file"
                            accept="image/*"
                            className="mt-1 block w-full rounded bg-gray-900 text-white px-3 py-2"
                            onChange={handleFileChange}
                        />
                        {pImage && (
                            <img
                                src={typeof pImage === "string" ? pImage : URL.createObjectURL(new Blob([pImage]))}
                                className="mt-2 rounded-lg shadow-md"
                                width={150}
                            />
                        )}
                    </label>
                    <label className="block text-white">
                        연령제한
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
                        현재 비밀번호
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
                        새 비밀번호
                        <input
                            type="password"
                            className="mt-1 block w-full rounded bg-gray-900 text-white px-3 py-2"
                            value={newPassword}
                            onChange={handlePasswordChange}
                            required
                        />
                    </label>
                    <label className="block text-white">
                        새 비밀번호 확인
                        <input
                            type="password"
                            className="mt-1 block w-full rounded bg-gray-900 text-white px-3 py-2"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            required
                        />
                        {confirmPassword && newPassword !== confirmPassword && (
                            <p className="text-sm text-red-500">Passwords do not match</p>
                        )}
                        {confirmPassword && newPassword === confirmPassword && (
                            <p className="text-sm text-green-500">Passwords match</p>
                        )}
                    </label>
                </div>
                <div className="flex space-x-4">
                    <button
                        type="submit"
                        className="border-2 border-blue-600 text-white hover:bg-blue-600 hover:text-white py-2 px-4 rounded mt-4"
                        style={{ backgroundColor: "transparent" }}
                    >
                        프로필 수정
                    </button>
                    <button
                        type="button"
                        onClick={handleDeleteProfile}
                        className="border-2 border-red-600 text-white hover:bg-red-600 hover:text-white py-2 px-4 rounded mt-4"
                        style={{ backgroundColor: "transparent" }}
                    >
                        프로필 삭제
                    </button>
                </div>
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

        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API}/v1/profiles/profile/${profileId}`);
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
            pPw: data.ppw,
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