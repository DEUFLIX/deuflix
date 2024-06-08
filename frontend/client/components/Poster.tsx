import React, { useState, useEffect, useContext } from 'react';
import { Genre, Movie, Series } from "../typing";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { useRouter } from "next/router";
import { GenreContext } from "../context/GenreContext";
import VideoPlayer from "./VideoPlayer";
import axios from 'axios';

interface IProps {
  posterData: Movie | Series | null;
  genreList: Genre[];
}

const Poster = ({ posterData, genreList = [] }: IProps) => {
  const router = useRouter().asPath;
  const currentGenre = useContext(GenreContext);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [suggestions, setSuggestions] = useState(0);
  const [ageRestriction, setAgeRestriction] = useState(0);
  const [actors, setActors] = useState<string[]>([]);

  useEffect(() => {
    console.log('Poster Data:', posterData); // 디버깅을 위해 posterData 로그 출력
    if (posterData && 'id' in posterData) {
      const fetchSuggestions = async () => {
        try {
          const idParam = 'movieImage' in posterData ? 'movieId' : 'seriesId';
          const response = await axios.get(`http://localhost:8080/api/v1/getSuggestions?${idParam}=${posterData.id}`);
          setSuggestions(response.data.suggestions);
          setAgeRestriction(response.data.age_restriction);
          setActors(response.data.actors);
        } catch (error) {
          console.error('Failed to fetch suggestions', error);
        }
      };

      fetchSuggestions();
    }
  }, [posterData]);

  const handlePlayClick = () => {
    setIsVideoOpen(true);
  };

  const handleCloseVideo = () => {
    setIsVideoOpen(false);
  };

  const handleInfoClick = () => {
    setIsInfoOpen(true);
  };

  const handleCloseInfo = () => {
    setIsInfoOpen(false);
  };

  const handlePlayInfoClick = () => {
    handleCloseInfo();
    handlePlayClick();
  };

  const handleAddToList = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/v1/addToList', {
        userId: 1,
        movieId: posterData?.id,
      });
      alert(response.data.message);
    } catch (error) {
      console.error('Failed to add movie to list', error);
      alert('Failed to add movie to list');
    }
  };

  const handleThumbUp = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/v1/incrementSuggestion', {
        movieId: posterData?.id,
      });
      alert(response.data.message);
      setSuggestions((prev) => prev + 1);
    } catch (error) {
      console.error('Failed to increment suggestion', error);
      alert('Failed to increment suggestion');
    }
  };

  const matchPercentage = suggestions ? `${suggestions}% 일치` : '';

  const getAgeRestrictionIcon = () => {
    if (ageRestriction === 12) return '/images/age_restrictions/icons8-fsk-12-100.png';
    if (ageRestriction === 16) return '/images/age_restrictions/icons8-fsk-16-100.png';
    if (ageRestriction === 18) return '/images/age_restrictions/icons8-fsk-18-100.png';
    return null;
  };

  const ageRestrictionIcon = getAgeRestrictionIcon();

  // Ensure 'year' is a string
  const year = posterData && typeof posterData.year === 'object' ? posterData.year.year : posterData?.year?.toString();

  return (
      <div key={posterData?.id || 'no-id'} className="p-0">
        {router !== "/" && (
            <div className="flex space-x-4 pt-20 z-20">
              <h1 className="font-bold md:max-w-lg md:text-lg lg:max-w-2xl lg:text-2xl">
                {router.substring(1)}
              </h1>
              <select
                  className="cursor-pointer mt-1 text-sm bg-black center items-center border-[1px] rounded-sm border-[#fff]"
                  onChange={(e) => currentGenre?.setCurrentGenre(e.target.value)}
              >
                <option value="">All</option>
                {genreList.map((genre) => (
                    <option key={genre.id} value={genre.genre}>
                      {genre.genre}
                    </option>
                ))}
              </select>
            </div>
        )}
        <div className="flex flex-col space-y-4 py-10 md:space-py-4 lg:h-[65vh] lg:justify-end lg:pb-12">
          <div className="absolute top-0 left-0 -z-10 h-[95vh]">
            {posterData && ('movieImage' in posterData ? (
                <img src={(posterData as Movie).movieImage} alt="Poster Image" className="h-[95vh] w-[100vw] object-cover" />
            ) : (
                <img src={(posterData as Series).seriesImage} alt="Poster Image" className="h-[95vh] w-[100vw] object-cover" />
            ))}
          </div>
          <h1 className="text-2xl font-bold md:text-3xl lg:text-7xl">
            {posterData?.title}
          </h1>
          <p className="max-w-xs text-xs md:max-w-lg md:text-lg lg:max-w-2xl lg:text-2xl">
            {posterData?.description}
          </p>
          <div className="flex space-x-3">
            <button className="navbarButton bg-white text-black transform hover:scale-105 transition duration-200" onClick={handlePlayClick}>
              <PlayArrowIcon />
              <span className="font-bold">Play</span>
            </button>
            <button className="navbarButton bg-gray-400 text-black transform hover:scale-105 transition duration-200" onClick={handleInfoClick}>
              <InfoOutlinedIcon />
              <span className="font-bold">Info</span>
            </button>
            <button className="navbarButton bg-white text-black transform hover:scale-105 transition duration-200" onClick={handleAddToList}>
              <AddIcon />
            </button>
            <button className="navbarButton bg-white text-black transform hover:scale-105 transition duration-200" onClick={handleThumbUp}>
              <ThumbUpIcon />
            </button>
          </div>
        </div>
        {isVideoOpen && posterData && (
            <VideoPlayer
                videoUrl={'movieUrl' in posterData ? (posterData as Movie).movieUrl : (posterData as Series).seriesUrl}
                subtitlesUrl={posterData && 'trailer' in posterData ? (posterData as Movie).trailer : (posterData as Series).trailer}
                onClose={handleCloseVideo}
            />
        )}
        {isInfoOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
              <div className="relative w-full max-w-5xl bg-black h-3/4 rounded-lg overflow-hidden">
                <button
                    className="absolute top-4 right-4 text-white text-3xl z-50"
                    onClick={handleCloseInfo}
                >
                  <CloseIcon />
                </button>
                <div className="relative w-full h-1/2">
                  <video className="w-full h-full object-cover" autoPlay muted>
                    {posterData && 'trailer' in posterData && (
                        <source src={(posterData as Movie).trailer} type="video/mp4" />
                    )}
                    {posterData && !('trailer' in posterData) && (
                        <source src={(posterData as Series).trailer} type="video/mp4" />
                    )}
                    Your browser does not support the video tag.
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 flex space-x-3">
                    <button
                        className="bg-white text-black px-4 py-2 rounded flex items-center space-x-2 transform hover:scale-105 transition duration-200"
                        onClick={handlePlayInfoClick}
                    >
                      <PlayArrowIcon />
                      <span className="font-bold">Play</span>
                    </button>
                    <button className="bg-white text-black px-4 py-2 rounded flex items-center space-x-2 transform hover:scale-105 transition duration-200" onClick={handleAddToList}>
                      <AddIcon />
                    </button>
                    <button className="bg-white text-black px-4 py-2 rounded flex items-center space-x-2 transform hover:scale-105 transition duration-200" onClick={handleThumbUp}>
                      <ThumbUpIcon />
                    </button>
                  </div>
                </div>
                <div className="p-4 text-white overflow-y-auto h-1/2 custom-scroll">
                  <h1 className="text-2xl font-bold">{posterData?.title}</h1>
                  <p>{posterData?.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-gray-400">Genre: </span>
                      {posterData?.genres && posterData.genres.map((g: Genre) => (
                          <span key={g.id}>{g.genre} </span>
                      ))}
                      {ageRestrictionIcon && (
                          <div className="inline-block ml-2">
                            <img src={ageRestrictionIcon} alt={`Age ${ageRestriction}`} className="inline-block" style={{ width: '48px', height: '48px' }} />
                          </div>
                      )}
                    </div>
                    <div>
                      <span className="text-gray-400">Actors: </span>
                      {actors.map((actor, index) => (
                          <span key={index}>{actor} </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-2">
                    {matchPercentage && (
                        <span className="text-green-400">{matchPercentage}</span>
                    )}
                  </div>
                  {posterData?.year && (
                      <p>
                        <span className="text-gray-400">Year: </span>
                        <span>{year}</span>
                      </p>
                  )}
                  {/* 시리즈의 경우 에피소드 목록 추가 */}
                  {'episodes' in posterData && (
                      <div className="mt-4">
                        <h2 className="text-xl font-bold">회차:</h2>
                        <ul>
                          {(posterData as Series).episodes.map(episode => (
                              <li key={episode.id} className="mt-2 flex items-start">
                                <img src={episode.thumbnailImage} alt={`Episode ${episode.episodeNumber}`} className="w-32 h-20 mr-4 object-cover" />
                                <div>
                                  <h3 className="text-lg font-semibold">{episode.episodeNumber}화 {episode.title}</h3>
                                  <p className="text-sm">{episode.description}</p>
                                  <p className="text-sm">Duration: {episode.duration} minutes</p>
                                </div>
                              </li>
                          ))}
                        </ul>
                      </div>
                  )}
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default Poster;
