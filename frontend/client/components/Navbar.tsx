import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { RiShutDownLine } from "react-icons/ri";

const Navbar: React.FC = () => {
  const [isScroll, setIsScroll] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const userState = useContext(UserContext);
  const router = useRouter();

  const logout = () => {
    window.localStorage.removeItem("auth");
    userState?.setState(null);
    router.push("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScroll(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const name = window.localStorage.getItem('selectedProfileName');
    const id = window.localStorage.getItem('selectedProfileId');
    console.log('Selected Profile Name:', name);
    console.log('Selected Profile ID:', id);
    setProfileName(name);
    setProfileId(id);
  }, []);

  const handleMouseEnter = () => {
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    setShowDropdown(false);
  };

  return (
      <header className={`${isScroll && `bg-[#141414]`}`}>
        <div className="flex items-center space-x-2 md:space-x-10">
          <img
              src="https://rb.gy/ulxxee"
              width={100}
              height={100}
              className="cursor-pointer object-contain"
          />
          <ul className="flex space-x-4 font-bold">
            <li className="navbarLink">
              <Link href="/">
                <a>Home</a>
              </Link>
            </li>
            <li className="navbarLink">
              <Link href="/movies">
                <a>Movies</a>
              </Link>
            </li>
            <li className="navbarLink">
              <Link href="/series">
                <a>Series</a>
              </Link>
            </li>
            <li className="navbarLink">
              <Link href="/my-list">
                <a>My List</a>
              </Link>
            </li>
          </ul>
        </div>

        <div
            className="flex items-center space-center text-sm font-light relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
          <div className="font-bold">
            {profileName ? profileName : (userState && userState.state?.token
                ? userState.state.name
                : "사용자")}
          </div>

          <div className="w-8 flex ml-4 mr-4">
            <img
                className="cursor-pointer rounded"
                src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png?20201013161117"
            />
          </div>

          {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10">
                <Link href={`/profiles?userId=${userState?.state?.id}&profileId=${profileId}`}>
                  <a className="block px-4 py-2 text-gray-800 hover:bg-gray-200">프로필 편집</a>
                </Link>
                <Link href={`/account/account?userId=${userState?.state?.id}&profileId=${profileId}`}>
                  <a className="block px-4 py-2 text-gray-800 hover:bg-gray-200">계정</a>
                </Link>
                <a
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                    onClick={logout}
                >
                  로그아웃
                </a>
              </div>
          )}

          <div className="font-bold">
            {userState && userState.state?.token ? (
                <>
                  <a className="cursor-pointer" onClick={logout}>
                    <RiShutDownLine className="text-2xl hover:text-[#E50914]" />
                  </a>
                </>
            ) : (
                ""
            )}
          </div>
        </div>
      </header>
  );
};

export default Navbar;
