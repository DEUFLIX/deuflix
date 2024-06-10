import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import NetflixLayout from '../components/NetflixLayout';
import { useUser } from '../context/UserContext';

declare global {
    interface Window {
        IMP: any;
    }
}

const membershipPlans = [
    {
        name: '프리미엄',
        price: '17000',
        quality: '가장 좋은',
        resolution: '4K(UHD) + HDR',
        devices: 4,
        downloadDevices: 6,
        ads: '없음',
    },
    {
        name: '스탠다드',
        price: '13500',
        quality: '좋은',
        resolution: '1080p(풀 HD)',
        devices: 2,
        downloadDevices: 2,
        ads: '없음',
    },
    {
        name: '광고형 스탠다드',
        price: '5500',
        quality: '좋은',
        resolution: '1080p(풀 HD)',
        devices: 2,
        downloadDevices: 2,
        ads: '있음',
    },
];

const Step4: React.FC = () => {
    const [selectedPlan, setSelectedPlan] = useState('');
    const { state: userState } = useUser();
    const router = useRouter();

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://cdn.iamport.kr/js/iamport.payment-1.2.0.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        }
    }, []);

    const handlePayment = async () => {
        if (!selectedPlan) {
            toast.error('멤버십을 선택해 주세요.');
            return;
        }

        const selectedMembership = membershipPlans.find(plan => plan.name === selectedPlan);

        if (!selectedMembership) {
            toast.error('올바른 멤버십을 선택해 주세요.');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:8081/api/create-payment`, {
                userId: userState?.id,
                membershipType: selectedMembership.name,
                amount: selectedMembership.price,
            });

            if (response.status === 200) {
                const { merchant_uid } = response.data;
                const { IMP } = window;

                IMP.init('imp48773364'); // 본인의 아임포트 가맹점 식별코드를 입력

                IMP.request_pay({
                    pg: 'kakaopay',
                    pay_method: 'card',
                    merchant_uid: merchant_uid,
                    name: selectedMembership.name,
                    amount: selectedMembership.price,
                    buyer_email: userState?.email,
                    buyer_name: userState?.user_name,
                }, async (rsp: any) => {
                    if (rsp.success) {
                        try {
                            const verifyResponse = await axios.post(`http://localhost:8081/api/verify-payment`, {
                                imp_uid: rsp.imp_uid,
                                merchant_uid: rsp.merchant_uid,
                                userId: userState?.id,
                                membershipType: selectedMembership.name,
                            });

                            console.log('verifyResponse:', verifyResponse); // 응답 출력

                            if (verifyResponse.status === 200) {
                                toast.success('결제가 완료되었습니다.');
                                await axios.post(`http://localhost:8081/api/save-payment`, {
                                    userId: userState?.id,
                                    membershipType: selectedMembership.name,
                                    amount: selectedMembership.price,
                                    paymentStatus: 'paid',
                                    merchant_uid: rsp.merchant_uid
                                });
                                router.push('/');
                            } else {
                                toast.error('결제 검증 중 오류가 발생했습니다.');
                            }
                        } catch (error) {
                            toast.error('결제 검증 중 오류가 발생했습니다.');
                        }
                    } else {
                        toast.error(`결제 실패: ${rsp.error_msg}`);
                    }
                });
            } else {
                toast.error('결제 중 오류가 발생했습니다.');
            }
        } catch (error) {
            toast.error('결제 중 오류가 발생했습니다.');
        }
    };

    return (
        <NetflixLayout>
            <div className="flex flex-col items-center justify-center min-h-screen bg-white">
                <div className="max-w-4xl w-full text-center">
                    <h2 className="text-xl font-bold mb-4 text-black">원하는 멤버십을 선택하세요</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {membershipPlans.map((plan, index) => (
                            <div
                                key={index}
                                className={`bg-gray-100 p-6 rounded-lg shadow-md ${selectedPlan === plan.name ? 'border-2 border-red-600' : ''}`}
                                onClick={() => setSelectedPlan(plan.name)}
                            >
                                <h3 className="text-xl font-semibold mb-2 text-black">{plan.name}</h3>
                                <p className="text-lg mb-2 text-black">{plan.price}원</p>
                                <ul className="text-left text-gray-600 space-y-1">
                                    <li>화질: {plan.quality}</li>
                                    <li>해상도: {plan.resolution}</li>
                                    <li>지원 디바이스: {plan.devices}대</li>
                                    <li>저장 디바이스: {plan.downloadDevices}대</li>
                                    <li>광고: {plan.ads}</li>
                                </ul>
                            </div>
                        ))}
                    </div>
                    <button
                        className="bg-red-600 text-white py-2 px-4 rounded mt-6"
                        onClick={handlePayment}
                    >
                        다음
                    </button>
                </div>
            </div>
        </NetflixLayout>
    );
};

export default Step4;