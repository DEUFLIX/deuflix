import axios from 'axios';
import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useRef } from 'react';
import { toast } from 'react-toastify';

const Register: NextPage = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const checkEmail = async () => {
    try {
      const email = emailRef.current?.value || '';
      console.log('Checking email:', email);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_NODE_API}/check-email?email=${email}`);
      console.log('Email check response:', response.data);
      return response.data.exists;
    } catch (error) {
      console.error('Error checking email:', error);
      toast.error('이메일 확인 중 오류가 발생했습니다.');
      return false;
    }
  };

  const handleStart = async () => {
    const email = emailRef.current?.value || '';
    const emailExists = await checkEmail();
    if (emailExists) {
      router.push(`/LoginPage?email=${email}`); // 사용자가 등록되어 있으면 LoginPage로 이동
    } else {
      router.push(`/Step1?email=${email}`); // 사용자가 등록되어 있지 않으면 Step1으로 이동
    }
  };

  return (
      <div className="relative flex h-screen w-screen flex-col md:items-center md:justify-center md:bg-transparent">
        <Head>
          <title>NetFlix-Register</title>
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
        <div className="z-20">
          <h1 className="text-6xl font-bold">Unlimited movies, TV shows, and more.</h1>
          <h2 className="flex items-center justify-center my-10 font-bold text-3xl">Watch anywhere. Cancel anytime.</h2>
          <div className="flex items-center justify-center">
            <label className="flex lg:w-[600px]">
              <input
                  type="email"
                  placeholder="Email"
                  ref={emailRef}
                  className="w-full text-black px-5 py-3.5 placeholder-[gray] outline-none focus:bg-[#454545]"
                  style={{ color: 'black' }} // 텍스트 색상을 검정색으로 설정
              />
              <button className="bg-[#E50914] w-32" onClick={handleStart}>
                Get Started
              </button>
            </label>
          </div>
        </div>
      </div>
  );
};

export default Register;
