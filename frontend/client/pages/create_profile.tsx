import axios from "axios";
import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";

const CreateProfile: NextPage = () => {
    const [profileName, setProfileName] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const userState = useContext(UserContext);
    const router = useRouter();

    const submitHandler = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (!userState || !userState.state) {
            toast.error("User is not logged in");
            return;
        }

        try {
            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_API}/profiles/insert`,
                {
                    uId: userState.state.id,
                    pName: profileName,
                    pImage: profileImage,
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
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data.message);
            } else {
                toast.error("Something went wrong");
            }
        }
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
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png"
                    className="absolute left-4 top-4 cursor-pointer object-contain md:left-10 md:top-6"
                    width={150}
                    height={150}
                />
            </div>

            <form
                onSubmit={submitHandler}
                className="relative mt-20 space-y-8 rounded bg-black/75 py-10 px-6 md:mt-0 md:max-w-md md:px-14"
            >
                <h1 className="text-4xl font-semibold">Create Profile</h1>
                <div className="space-y-4">
                    <label className="inline-block w-full">
                        <input
                            type="text"
                            placeholder="Profile Name"
                            className="w-full rounded bg-[#333333] px-5 py-3.5 placeholder-[gray] outline-none"
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                            required
                        />
                    </label>
                    <label className="inline-block w-full">
                        <input
                            type="text"
                            placeholder="Profile Image URL"
                            className="w-full rounded bg-[#333333] px-5 py-3.5 placeholder-[gray] outline-none"
                            value={profileImage}
                            onChange={(e) => setProfileImage(e.target.value)}
                        />
                    </label>
                </div>
                <button
                    type="submit"
                    className="w-full py-3.5 bg-[#e50914] rounded font-semibold text-lg text-white uppercase tracking-wide hover:bg-[#b20710] transition duration-200"
                >
                    Create Profile
                </button>
            </form>
        </div>
    );
};

export default CreateProfile;
