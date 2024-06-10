import React from 'react';
import { MdClose } from 'react-icons/md';

interface VideoModalProps {
    videoUrl: string;
    onClose: () => void;
    width?: string; // 추가: width와 height를 props로 받도록 설정
    height?: string;
}

const VideoModal: React.FC<VideoModalProps> = ({ videoUrl, onClose, width = '80%', height = '80%' }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="relative" style={{ width, height }}>
                <button
                    className="absolute top-4 right-4 text-white text-3xl z-50"
                    onClick={onClose}
                    style={{ zIndex: 1000 }}
                >
                    <MdClose />
                </button>
                <video
                    className="w-full h-full z-10"
                    controls
                    autoPlay
                >
                    <source src={videoUrl} type="video/mp4" />
                </video>
            </div>
        </div>
    );
};

export default VideoModal;
