import axios from "axios";
import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";

const Login: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailClicked, setEmailClicked] = useState(false);
  const [passwordClicked, setPasswordClicked] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const userState = useContext(UserContext);
  const router = useRouter();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPassword = localStorage.getItem("rememberedPassword");
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return "이메일 주소는 반드시 입력하셔야 합니다.";
    }
    if (!email.includes("@")) {
      return "이메일 주소에 '@'를 포함해 주세요.";
    }
    if (!emailRegex.test(email)) {
      return "정확한 이메일 주소나 전화번호를 입력하세요.";
    }
    return "";
  };

  const validatePassword = (password: string) => {
    if (password.length < 4 || password.length > 60) {
      return "비밀번호는 4~60자 사이여야 합니다.";
    }
    return "";
  };

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    if (emailError || passwordError) {
      setEmailError(emailError);
      setPasswordError(passwordError);
      setEmailClicked(true);
      setPasswordClicked(true);
      return;
    }
    setEmailError("");
    setPasswordError("");

    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email);
      localStorage.setItem("rememberedPassword", password);
    } else {
      localStorage.removeItem("rememberedEmail");
      localStorage.removeItem("rememberedPassword");
    }

    try {
      const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API}/v1/auth/login`,
          {
            username: email,
            password: password,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
      );
      if (data.error) {
        toast.error(data.error);
      } else {
        userState?.setState({ ...data });

        window.localStorage.setItem("auth", JSON.stringify(data));
        router.push("/");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
      <div className="relative flex flex-col min-h-screen w-full">
        <Head>
          <title>NetFlix-SignIn</title>
        </Head>
        <div className="relative flex flex-1 items-center justify-center">
          <Image
              src="https://assets.nflxext.com/ffe/siteui/vlv3/79fe83d4-7ef6-4181-9439-46db72599559/bd4f2024-8853-47ee-b84b-779b52fd5f12/TR-tr-20221017-popsignuptwoweeks-perspective_alpha_website_small.jpg"
              className="-z-10 opacity-30 sm:!inline h-full w-full"
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
              className="relative mt-40 space-y-8 rounded bg-black/75 py-10 px-6 md:mt-40 md:max-w-md md:px-14 mb-20"
          >
            <h1 className="text-4xl font-semibold">로그인</h1>
            <div className="space-y-4">
              <label className="inline-block w-full">
                <input
                    type="text"
                    placeholder="이메일 주소"
                    value={email}
                    className={`w-full rounded bg-[#333333] px-5 py-3.5 placeholder-[gray] outline-none focus:bg-[#454545] ${
                        emailError ? "border border-red-500" : ""
                    }`}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => {
                      setEmailClicked(true);
                      setEmailFocused(true);
                    }}
                    onBlur={() => setEmailFocused(false)}
                />
              </label>
              {emailClicked && !emailFocused && emailError && (
                  <div className="text-red-500 mt-2 flex justify-start items-center space-x-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                      <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v4a1 1 0 002 0V5zm0 6a1 1 0 10-2 0v2a1 1 0 002 0v-2z"
                          clipRule="evenodd"
                      />
                    </svg>
                    <span>{emailError}</span>
                  </div>
              )}
              <label className="inline-block w-full relative">
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호"
                    value={password}
                    className={`w-full rounded bg-[#333333] px-5 py-3.5 placeholder-[gray] outline-none focus:bg-[#454545] ${
                        passwordError ? "border border-red-500" : ""
                    }`}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => {
                      setPasswordClicked(true);
                      setPasswordFocused(true);
                    }}
                    onBlur={() => setPasswordFocused(false)}
                />
                {passwordClicked && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
                    >
                      {showPassword ? (
                          <img src="/eye-off.svg" className="h-6 w-6" alt="Hide"/>
                      ) : (
                          <img src="/eye.svg" className="h-6 w-6" alt="Show"/>
                      )}
                    </button>
                )}
              </label>
              {passwordClicked && !passwordFocused && passwordError && (
                  <div className="text-red-500 mt-2 flex justify-start items-center space-x-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                      <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v4a1 1 0 002 0V5zm0 6a1 1 0 10-2 0v2a1 1 0 002 0v-2z"
                          clipRule="evenodd"
                      />
                    </svg>
                    <span>{passwordError}</span>
                  </div>
              )}
            </div>
            <button
                type="submit"
                className="w-full rounded bg-[#E50914] py-3 font-semibold mt-4"
            >
              로그인
            </button>
            <div className="mt-4 text-center">
              <a href="#" className="text-white-600 hover:underline">
                비밀번호를 잊으셨나요?
              </a>
            </div>
            <label className="flex items-center space-x-2 text-[white]">
              <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4"
              />
              <span>로그인 정보 저장</span>
            </label>
            <div className="text-[gray] mt-4 text-center">
              Netflix 회원이 아닌가요?{" "}
              <Link href="/register">
                <a className="cursor-pointer text-white hover:underline">
                  지금가입하세요.
                </a>
              </Link>
            </div>
          </form>
        </div>

        {/* 추가된 섹션 */}
        <div className="w-full bg-black py-16 text-white">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center px-4">
            <div className="w-full md:w-1/2">
              <h3 className="font-semibold text-3xl mb-4 text-center md:text-left">
                TV로 즐기세요
              </h3>
              <p className="text-center md:text-left">
                스마트 TV, PlayStation, Xbox, Chromecast, Apple TV, 블루레이
                플레이어 등 다양한 디바이스에서 시청하세요.
              </p>
            </div>
            <video
                src="/login_1.m4v"
                autoPlay
                muted
                loop
                controls
                className="w-full md:w-1/2 h-auto mb-4 md:mb-0 md:mr-4"
            />
          </div>
        </div>

        <div className="w-full bg-black py-16 text-white mt-2">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center px-4">
            <video
                src="/login_2.m4v"
                autoPlay
                muted
                loop
                controls
                className="w-full md:w-1/2 h-auto mb-4 md:mb-0 md:mr-4"
            />
            <div className="w-full md:w-1/2">
              <h3 className="font-semibold text-3xl mb-4 text-center md:text-left">
                어디서나 자유롭게 시청하세요
              </h3>
              <p className="text-center md:text-left">
                각종 영화와 시리즈를 스마트폰, 태블릿, 노트북, TV에서 무제한으로
                스트리밍하세요.
              </p>
            </div>
          </div>
        </div>
        <div className="w-full bg-black py-16 text-white mt-2">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center px-4">
            <div className="w-full md:w-1/2">
              <h3 className="font-semibold text-3xl mb-4 text-center md:text-left">
                어린이 전용 프로필을 만들어 보세요
              </h3>
              <p className="text-center md:text-left">
                자기만의 공간에서 좋아하는 캐릭터와 즐기는 신나는 모험. 자녀에게
                이 특별한 경험을 선물하세요. 넷플릭스 회원이라면 무료입니다.
              </p>
            </div>
            <img
                src="/login_3.png"
                className="w-full md:w-1/2 h-auto mb-4 md:mb-0 md:mr-4"
            />
          </div>
        </div>

        <div className="w-full bg-black py-16 text-white mt-2">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center px-4">
            <img
                src="/login_4.jpg"
                className="w-full md:w-1/2 h-auto mb-4 md:mb-0 md:mr-4"
            />
            <div className="w-full md:w-1/2">
              <h3 className="font-semibold text-3xl mb-4 text-center md:text-left">
                즐겨 보는 콘텐츠를 저장해 오프라인으로 시청하세요
              </h3>
              <p className="text-center md:text-left">
                비행기, 기차, 잠수함. 어디서든 시청하세요.
              </p>
            </div>
          </div>
        </div>
        {/* 추가된 섹션 끝 */}

        {/* 아코디언 FAQ 섹션 */}
        <div className="w-full bg-black py-16 text-white mt-2">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-semibold mb-6 text-center">
              자주 묻는 질문
            </h2>
            <div className="space-y-4">
              {faqData.map((faq, index) => (
                  <div key={index}>
                    <button
                        onClick={() => toggleFAQ(index)}
                        className="w-full text-left px-4 py-5  bg-[#333] rounded-md border border-[#333] mt-2"
                    >
                      <h3 className="text-2xl font-semibold">{faq.question}</h3>
                    </button>
                    {openFAQ === index && (
                        <div className="px-4 py-5 text-[white] bg-[#333] mt-2 rounded-md text-xl">
                          <p>{faq.answer}</p>
                        </div>
                    )}
                  </div>
              ))}
            </div>
          </div>
        </div>
        {/* 아코디언 FAQ 섹션 끝 */}
      </div>
  );
};

const faqData = [
  {
    question: "넷플릭스에서 어떤 콘텐츠를 시청할 수 있나요?",
    answer:
        "넷플릭스는 장편 영화, 다큐멘터리, 시리즈, 애니메이션, 각종 상을 수상한 넷플릭스 오리지널 등 수많은 콘텐츠를 확보하고 있습니다. 마음에 드는 콘텐츠를 원하는 시간에 원하는 만큼 시청하실 수 있습니다.",
  },
  {
    question: "넷플릭스란 무엇인가요?",
    answer:
        "넷플릭스는 각종 수상 경력에 빛나는 시리즈, 영화, 애니메이션, 다큐멘터리 등 다양한 콘텐츠를 인터넷 연결이 가능한 수천 종의 디바이스에서 시청할 수 있는 스트리밍 서비스입니다.\n" +
        "\n" +
        "저렴한 월 요금으로 원하는 시간에 원하는 만큼 즐길 수 있습니다. 무궁무진한 콘텐츠가 준비되어 있으며 매주 새로운 시리즈와 영화가 제공됩니다.",
  },
  {
    question: "넷플릭스 요금은 얼마인가요?",
    answer:
        "스마트폰, 태블릿, 스마트 TV, 노트북, 스트리밍 디바이스 등 다양한 디바이스에서 월정액 요금 하나로 넷플릭스를 시청하세요. 멤버십 요금은 월 5,500원부터 17,000원까지 다양합니다. 추가 비용이나 약정이 없습니다.",
  },
  {
    question: "어디에서 시청할 수 있나요?",
    answer:
        "언제 어디서나 시청할 수 있습니다. 넷플릭스 계정으로 로그인하면 PC에서 netflix.com을 통해 바로 시청할 수 있으며, 인터넷이 연결되어 있고 넷플릭스 앱을 지원하는 디바이스(스마트 TV, 스마트폰, 태블릿, 스트리밍 미디어 플레이어, 게임 콘솔 등)에서도 언제든지 시청할 수 있습니다.\n" +
        "\n" +
        "iOS, Android, Windows 10용 앱에서는 좋아하는 시리즈를 저장할 수도 있습니다. 저장 기능을 이용해 이동 중이나 인터넷에 연결할 수 없는 곳에서도 시청하세요. 넷플릭스는 어디서든 함께니까요.",
  },
  {
    question: "멤버십을 해지하려면 어떻게 하나요?",
    answer:
        "넷플릭스는 부담 없이 간편합니다. 성가신 계약도, 약정도 없으니까요. 멤버십 해지도 온라인에서 클릭 두 번이면 완료할 수 있습니다. 해지 수수료도 없으니 원할 때 언제든 계정을 시작하거나 종료하세요.",
  },
  {
    question: "아이들이 넷플릭스를 봐도 좋을까요?",
    answer:
        "멤버십에 넷플릭스 키즈 환경이 포함되어 있어 자녀가 자기만의 공간에서 가족용 시리즈와 영화를 즐기는 동안 부모가 이를 관리할 수 있습니다.\n" +
        "\n" +
        "키즈 프로필과 더불어 PIN 번호를 이용한 자녀 보호 기능도 있어, 자녀가 시청할 수 있는 콘텐츠의 관람등급을 제한하고 자녀의 시청을 원치 않는 특정 작품을 차단할 수도 있습니다.",
  },
  // Add more FAQs as needed
];
export default Login;
