import { useRouter } from 'next/router';
import Link from 'next/link';
import NetflixLayout from '../components/NetflixLayout';

const Step1: React.FC = () => {
    const router = useRouter();
    const { email } = router.query;

    return (
        <NetflixLayout>
            <div className="flex flex-col items-center justify-center min-h-screen bg-white">
                <div className="max-w-md w-full text-center">
                    <h2 className="text-xl font-bold mb-4">계정 설정 마무리하기</h2>
                    <p className="text-gray-600 mb-8">
                        맞춤형 콘텐츠 서비스, 넷플릭스! 비밀번호를 설정하고 넷플릭스를 시청하세요.
                    </p>
                    <Link href={`/Step2?email=${email}`}>
                        <button className="bg-red-600 text-white py-2 px-4 rounded">다음</button>
                    </Link>
                </div>
            </div>
        </NetflixLayout>
    );
};

export default Step1;
