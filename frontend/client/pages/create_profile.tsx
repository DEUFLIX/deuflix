import axios from "axios";
import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";
import AWS from "aws-sdk";

const AWS_ACCESS_KEY_ID = "AKIA6ODU2RE7DOSJZJHM" || "";
const AWS_SECRET_ACCESS_KEY = "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" || "";
const AWS_REGION = "ap-northeast-2" || "";
const AWS_BUCKET_NAME = "hanggubuket" || "";

const CreateProfile: NextPage = () => {
    const [profileName, setProfileName] = useState("");
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [age, setAge] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const userState = useContext(UserContext);
    const router = useRouter();

    const s3 = new AWS.S3({
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
        region: AWS_REGION,
    });

    const submitHandler = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (!userState || !userState.state || !userState.state.id) {
            toast.error("User is not logged in");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            let imageUrl = "";
            if (profileImage) {
                const imageData = await uploadImage(profileImage);
                imageUrl = imageData.Location;
            }

            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_API}/v1/profiles/insert`,
                {
                    uId: userState.state.id,
                    pName: profileName,
                    pImage: imageUrl,
                    age: age,
                    pPw: password,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                }
            );
            toast.success("Profile created successfully");
            router.push(`/profiles?userId=${userState.state.id}`);
        } catch (error) {
            console.error(error);
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 400) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Failed to create profile");
                }
            } else {
                toast.error("Something went wrong");
            }
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setConfirmPassword(e.target.value);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setProfileImage(file);
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

    return (
        <div className="relative flex h-screen w-screen flex-col md:items-center md:justify-center md:bg-transparent">
            <Head>
                <title>Create Profile</title>
            </Head>
            <Image
                src="https://assets.nflxext.com/ffe/siteui/vlv3/79fe83d4-7ef6-4181-9439-46db72599559/bd4f2024-8853-47ee-b84b-779b52fd5f12/TR-tr-20221017-popsignuptwoweeks-perspective_alpha_website_small.jpg"
                className="-z-10 opacity-30 sm:!inline h-screen w-screen"
                layout="fill"
                objectFit="cover"
            />
            <div>
                <a href="http://localhost:3000">
                    <img
                        src="/netflix-logo.png"
                        className="absolute left-4 top-4 cursor-pointer object-contain md:left-10 md:top-6"
                        width={150}
                        height={150}
                    />
                </a>
            </div>

            <form
                onSubmit={submitHandler}
                className="relative mt-20 space-y-8 rounded bg-black/75 py-10 px-6 md:mt-0 md:max-w-md md:px-14"
            >
                <h1 className="text-4xl font-semibold">Create Profile</h1>
                <div className="space-y-4">
                    <label className="block text-white">
                        Profile Name
                        <input
                            type="text"
                            className="mt-1 block w-full rounded bg-gray-900 text-white px-3 py-2"
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                            required
                        />
                    </label>
                    <label className="block text-white">
                        Profile Image (Optional)
                        <input
                            type="file"
                            accept="image/*"
                            className="mt-1 block w-full rounded bg-gray-900 text-white px-3 py-2"
                            onChange={handleFileChange}
                        />
                        {profileImage && (
                            <img
                                src={URL.createObjectURL(profileImage)}
                                className="mt-2 rounded-lg shadow-md"
                                width={150}
                            />
                        )}
                    </label>
                    <label className="block text-white">
                        Age
                        <input
                            type="text"
                            className="mt-1 block w-full rounded bg-gray-900 text-white px-3 py-2"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            required
                        />
                    </label>
                    <label className="block text-white">
                        Password
                        <input
                            type="password"
                            className="mt-1 block w-full rounded bg-gray-900 text-white px-3 py-2"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                        />
                    </label>
                    <label className="block text-white">
                        Confirm Password
                        <input
                            type="password"
                            className="mt-1 block w-full rounded bg-gray-900 text-white px-3 py-2"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            required
                        />
                        {(password !== "" || confirmPassword !== "") && (
                            <>
                                {password !== confirmPassword ? (
                                    <p className="text-sm text-red-500">Passwords do not match</p>
                                ) : (
                                    <p className="text-sm text-green-500">Passwords match</p>
                                )}
                            </>
                        )}
                    </label>
                </div>
                <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded mt-4"
                >
                    Create Profile
                </button>
            </form>
        </div>
    );
};

export default CreateProfile;
