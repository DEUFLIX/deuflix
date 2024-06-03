import React from 'react';
import { MdClose } from 'react-icons/md';

interface VideoModalProps {
    videoUrl: string;
    onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ videoUrl, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="relative w-11/12 h-3/4">
                <button
                    className="absolute top-4 right-4 text-white text-3xl"
                    onClick={onClose}
                >
                    <MdClose />
                </button>
                <video
                    className="w-full h-full"
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
