import axios from 'axios';
import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';

const Register: NextPage = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return '이메일 주소는 반드시 입력하셔야 합니다.';
    }
    if (!email.includes('@')) {
      return "이메일 주소에 '@'를 포함해 주세요.";
    }
    if (!emailRegex.test(email)) {
      return "'@' 뒷 부분을 입력해 주세요.";
    }
    return '';
  };

  const checkEmail = async () => {
    try {
      const email = emailRef.current?.value || '';
      console.log('Checking email:', email);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_NODE_API}/api/check-email`, {
        params: {
          email: email
        }
      });
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
    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      return;
    }
    setEmailError('');
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
          <a href="http://localhost:3000">
            <img
                src="/netflix-logo.png"
                className="absolute left-4 top-4 cursor-pointer object-contain md:left-10 md:top-6"
                width={150}
                height={150}
            />
          </a>
        </div>
        <div className="z-20 text-center p-4">
          <h1 className="text-6xl font-bold">영화, 시리즈 등을 무제한으로</h1>
          <h2 className="my-10 font-bold text-2xl">어디서나 자유롭게 시청하세요. 해지는 언제든 가능합니다.</h2>
          <h3 className="my-10 font-bold text-xl">시청할 준비가 되셨나요? 멤버십을 등록하거나 재시작하려면 이메일 주소를 입력하세요.</h3>
          <div className="flex items-center justify-center space-x-2">
            <label className="flex w-full max-w-md relative">
              <input
                  type="email"
                  placeholder="이메일 주소"
                  ref={emailRef}
                  className={`flex-grow text-white px-5 py-3.5 placeholder-gray-500 outline-none focus:bg-gray-700 ${emailError ? 'border border-red-500' : ''}`}
                  style={{ color: 'black' }}
              />
              <button className="bg-[#E50914] px-6 py-3.5 text-white font-bold transition transform hover:scale-105 active:scale-95" onClick={handleStart}>
                시작하기 &gt;
              </button>
            </label>
          </div>
          {emailError && (
              <div className="text-red-500 mt-2 flex justify-center items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v4a1 1 0 002 0V5zm0 6a1 1 0 10-2 0v2a1 1 0 002 0v-2z" clipRule="evenodd" />
                </svg>
                <span>{emailError}</span>
              </div>
          )}
        </div>
      </div>
  );
};

export default Register;
