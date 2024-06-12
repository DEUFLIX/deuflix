import React from 'react';
import { Series } from '../typing';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface SeriesCardProps {
    series: Series;
    isHovered: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onInfoClick: (series: Series) => void;
    onPlayClick: (url: string) => void;
}

const SeriesCard: React.FC<SeriesCardProps> = ({ series, isHovered, onMouseEnter, onMouseLeave, onInfoClick, onPlayClick }) => {
    const imageUrl = series.seriesImage;
    const playUrl = series.seriesUrl;

    return (
        <div
            className={`series-card relative ${isHovered ? 'scale-110 z-50 shadow-lg border-2 border-white' : 'scale-95 z-10'} transform transition-transform duration-300 rounded-lg`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <img src={imageUrl} alt={series.seriesTitle} className={`series-image ${isHovered ? 'invisible' : 'visible'} rounded-lg`} />
            {isHovered && (
                <div className="overlay-card absolute w-full h-auto bg-[#141414] rounded-lg p-4">
                    <video className="w-full h-40 object-cover rounded-t-lg" autoPlay muted>
                        <source src={series.trailer} type="video/mp4" />
                    </video>
                    <div className="p-4">
                        <div className="flex space-x-3 mb-4">
                            <button className="navbarButton bg-white text-black transform hover:scale-105 transition duration-200 rounded-lg shadow" onClick={() => onPlayClick(playUrl)}>
                                <PlayArrowIcon />
                                <span className="font-bold">Play</span>
                            </button>
                            <button className="navbarButton bg-gray-400 text-black transform hover:scale-105 transition duration-200 rounded-lg shadow" onClick={() => onInfoClick(series)}>
                                <InfoOutlinedIcon />
                                <span className="font-bold">Info</span>
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                {'suggestions' in series && (
                                    <span className="text-green-400">{series.suggestions}% 일치</span>
                                )}
                            </div>
                            <div className="text-white text-lg font-bold">
                                {series.seriesTitle}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeriesCard;
