import React from 'react';
import Link from 'next/link';
import NetflixLayout from '../components/NetflixLayout';

const Step3: React.FC = () => {
    return (
        <NetflixLayout>
            <div className="flex flex-col items-center justify-center min-h-screen bg-white">
                <div className="max-w-md w-full text-center">
                    <h2 className="text-xl font-bold mb-4">원하는 멤버십을 선택하세요</h2>
                    <ul className="text-left text-gray-600 mb-8 space-y-2">
                        <li>무약정, 무료위약금, 해지 조건 없음</li>
                        <li>하나의 요금으로 즐기는 모든 콘텐츠</li>
                        <li>거치지 않고 모든 디바이스에서 넷플릭스를 즐기세요</li>
                    </ul>
                    <Link href="/Step4">
                        <button className="bg-red-600 text-white py-2 px-4 rounded">다음</button>
                    </Link>
                </div>
            </div>
        </NetflixLayout>
    );
};

export default Step3;
