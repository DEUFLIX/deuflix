import React from 'react';
import { Movie, Series } from '../typing';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface MovieCardProps {
    item: Movie | Series;
    isHovered: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onInfoClick: (item: Movie | Series) => void;
    onPlayClick: (url: string) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ item, isHovered, onMouseEnter, onMouseLeave, onInfoClick, onPlayClick }) => {
    const getAgeRestrictionIcon = (ageRestriction: number) => {
        switch (ageRestriction) {
            case 12:
                return '/images/age_restrictions/icons8-fsk-12-100.png';
            case 16:
                return '/images/age_restrictions/icons8-fsk-16-100.png';
            case 18:
                return '/images/age_restrictions/icons8-fsk-18-100.png';
            default:
                return null;
        }
    };

    const ageRestriction = 'age_restriction' in item ? item.age_restriction : 0;
    const ageRestrictionIcon = getAgeRestrictionIcon(ageRestriction);
    const imageUrl = 'movieImage' in item ? item.movieImage : item.seriesImage;
    const playUrl = 'movieUrl' in item ? item.movieUrl : item.seriesUrl;

    // Truncate title to 3 characters if it's longer than 3 characters
    const truncateTitle = (title, maxLength) => {
        return title.length > maxLength ? title.slice(0, maxLength) + '...' : title;
    };

    return (
        <div
            className={`movie-card relative ${isHovered ? 'scale-110 z-50 shadow-lg' : 'scale-95 z-10'} transform transition-transform duration-300 rounded-lg`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <img src={imageUrl} alt={item.title} className={`movie-image ${isHovered ? 'invisible' : 'visible'} rounded-lg`} />
            {isHovered && (
                <div className="overlay-card absolute w-full h-auto bg-[#141414] rounded-lg p-4">
                    <video className="w-full h-40 object-cover rounded-t-lg" autoPlay muted>
                        <source src={item.trailer} type="video/mp4" />
                    </video>
                    <div className="p-4">
                        <div className="flex space-x-3 mb-4">
                            <button className="navbarButton bg-white text-black transform hover:scale-105 transition duration-200 rounded-lg shadow small-button" onClick={() => onPlayClick(playUrl)}>
                                <PlayArrowIcon />
                                <span className="font-bold">Play</span>
                            </button>
                            <button className="navbarButton bg-gray-400 text-black transform hover:scale-105 transition duration-200 rounded-lg shadow small-button" onClick={() => onInfoClick(item)}>
                                <InfoOutlinedIcon />
                                <span className="font-bold">Info</span>
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                {'suggestions' in item && (
                                    <span className="text-green-400">{item.suggestions}% 일치</span>
                                )}
                                {ageRestrictionIcon && <img src={ageRestrictionIcon} alt={`Age ${ageRestriction}`} style={{ width: '45px', height: '45px' }} />}
                            </div>
                            <div className="text-white text-lg font-bold truncate">
                                {truncateTitle(item.title, 3)}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieCard;
