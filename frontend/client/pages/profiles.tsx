import axios from "axios";
import { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import React, { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { UserContext } from "../context/UserContext";

type Profile = {
    id: number;
    UId: number;
    pname: string;
    pImage: string | null; // 프로필 이미지 경로
};

interface ProfilesPageProps {
    profiles: Profile[];
}

const ProfilesPage: NextPage<ProfilesPageProps> = ({ profiles }) => {
    const router = useRouter();
    const userState = useContext(UserContext);

    const handleProfileClick = (profileId: number, profileName: string) => {
        window.localStorage.setItem('selectedProfileName', profileName);
        router.push("/");
    };

    const handleCreateProfile = () => {
        if (userState?.state?.id) {
            router.push(`/create_profile?userId=${userState.state.id}`);
        } else {
            // 로그인 되어 있지 않은 경우 처리
            console.error("User is not logged in");
        }
    };

    const handleEditProfile = () => {
        const userId = userState?.state?.id;
        if (userId) {
            router.push(`/profiles_edit?userId=${userId}`);
        }
    };

    useEffect(() => {
        profiles.forEach(profile => {
            console.log("Profile:", profile); // 프로필 전체 출력
            console.log("pImage : " + profile.pImage);
        });
    }, [profiles]);

    return (
        <div className="relative flex h-screen w-screen flex-col md:items-center md:justify-center md:bg-transparent" style={{ userSelect: 'none' }}>
            <Head>
                <title>Netflix-Profiles</title>
            </Head>
            <Image
                src="https://assets.nflxext.com/ffe/siteui/vlv3/79fe83d4-7ef6-4181-9439-46db72599559/bd4f2024-8853-47ee-b84b-779b52fd5f12/TR-tr-20221017-popsignuptwoweeks-perspective_alpha_website_small.jpg"
                className="-z-10 opacity-30 sm:!inline h-screen w-screen"
                layout="fill"
                objectFit="cover"
            />
            <div>
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png/2560px-Netflix_2015_logo.svg.png"
                    className="absolute left-4 top-4 cursor-pointer object-contain md:left-10 md:top-6"
                    width={150}
                    height={150}
                />
            </div>

            <div className="flex flex-col items-center justify-center h-screen z-10">
                <h1 className="text-4xl font-semibold mb-8">Deuflix를 실행할 프로필을 선택해주세요.</h1>
                <div className="flex flex-wrap justify-center items-center space-x-10">
                    {profiles.map((profile) => (
                        <div key={profile.id} className="flex flex-col items-center mb-4 cursor-pointer">
                            <button onClick={() => handleProfileClick(profile.id, profile.pname)} className="flex flex-col items-center">
                                <div className="h-24 w-24 overflow-hidden ">
                                    {profile.pImage ? (
                                        <img src={profile.pImage} alt={profile.pname} className="h-full w-full object-cover" />
                                    ) : (
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png?20201013161117" alt="Default Profile" className="h-full w-full object-cover" />
                                    )}
                                </div>
                                <span className="mt-2 text-white">{profile.pname || 'No Name'}</span>
                            </button>
                        </div>
                    ))}
                    {profiles.length < 4 && (
                        <div className="flex flex-col items-center mb-4 cursor-pointer">
                            <button onClick={handleCreateProfile} className="flex flex-col items-center">
                                <div className="h-24 w-24 flex items-center justify-center rounded-full bg-gray-800">
                                    <span className="text-2xl text-white">+</span>
                                </div>
                                <span className="mt-2 text-white">Create Profile</span>
                            </button>
                        </div>
                    )}
                </div>
                <button onClick={handleEditProfile} className="mt-4 px-4 py-2 border-4 border-white-600 text-white rounded cursor-pointer bg-transparent">
                    프로필 관리
                </button>
            </div>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    try {
        const userId = query.userId as string;
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API}/profiles/${userId}`);
        console.log("Profiles data:", data);
        return {
            props: {
                profiles: data,
            },
        };
    } catch (error) {
        console.error("Failed to fetch profiles:", error);
        return {
            props: {
                profiles: [],
            },
        };
    }
};

export default ProfilesPage;
