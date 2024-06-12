import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Poster from "../components/Poster";
import axios from "axios";
import { Genre, List, Movie, Series } from "../typing";
import { GenreContext } from "../context/GenreContext";
import Lists from "../components/Lists";
import { UserContext } from "../context/UserContext";
import MovieList from '../components/MovieList'; // MovieList 컴포넌트 추가

interface IProps {
  initialPosterData: Movie | Series | null;
  genreList: Genre[];
  error?: string;
}

const Home = ({ initialPosterData, genreList, error }: IProps) => {
  const [posterData, setPosterData] = useState<Movie | Series | null>(initialPosterData);
  const [liste, setListe] = useState<List[]>([]);
  const currentGenre = useContext(GenreContext);
  const router = useRouter();
  const currentType = router.asPath.substring(1) || 'defaultType';
  const state = useContext(UserContext);

  useEffect(() => {
    const getListe = async () => {
      try {
        const type = currentType || 'defaultType';
        const genre = currentGenre?.currentGenre || 'defaultGenre';
        const res = await axios.get(
            `http://localhost:8080/api/lists/genre/?type=${type}&genre=${genre}`
        );
        setListe(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getListe();
  }, [currentType, currentGenre?.currentGenre]);

  const handleLoginPage = () => {
    if (typeof window !== "undefined") {
      router.replace("/login");
    }
  };

  if (state?.state == null) {
    return (
        <>
          <div>Goto Login </div>
          {handleLoginPage()}
        </>
    );
  }

  if (error) {
    return (
        <div className="relative h-screen bg-gradient-to-b from-gray-900/10 to-[#010511] lg:h-[95vh] flex items-center justify-center text-white">
          <h1>Error: {error}</h1>
        </div>
    );
  }

  const fetchRandomMovie = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/movies/random?type=movies');
      setPosterData(response.data);
      console.log("randomMovieResponse:", response.data);
    } catch (error) {
      console.error('Failed to fetch random movie data', error);
    }
  };

  const fetchRandomSeries = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/series/random');
      setPosterData(response.data);
      console.log("randomSeriesResponse:", response.data);
    } catch (error) {
      console.error('Failed to fetch random series data', error);
    }
  };

  const fetchRandomHome = async () => {
    try {
      const [randomMovieResponse, randomSeriesResponse] = await Promise.all([
        axios.get('http://localhost:8080/api/v1/movies/random?type=movies'),
        axios.get('http://localhost:8080/api/v1/series/random')
      ]);

      const isMovie = Math.random() < 0.5;
      const selectedData = isMovie ? randomMovieResponse.data : randomSeriesResponse.data;
      setPosterData(selectedData);

      console.log("randomMovieResponse:", randomMovieResponse.data);
      console.log("randomSeriesResponse:", randomSeriesResponse.data);
    } catch (error) {
      console.error('Failed to fetch random home data', error);
    }
  };

  return (
      <div className="relative h-screen bg-gradient-to-b from-gray-900/10 to-[#010511] lg:h-[95vh]">
        <Head>
          <title>NetFlix{currentType === "" ? "" : "-" + currentType}</title>
        </Head>
        <Navbar onHomeClick={fetchRandomHome} onMoviesClick={fetchRandomMovie} onSeriesClick={fetchRandomSeries} />
        <main className="relative pb-10 pl-4 lg:pl-10">
          <Poster posterData={posterData} genreList={genreList} />
          <section className="md:space-y-10 mt-12">
            <MovieList /> {/* MovieList 컴포넌트 추가 */}
            {/* 추가적인 카테고리 리스트 */}
            {liste && liste.map((l) => <Lists key={l.id} list={l} />)}
          </section>
        </main>
      </div>
  );
};

export default Home;

export const getServerSideProps = async () => {
  try {
    const [randomMovieResponse, randomSeriesResponse, genreListResponse] = await Promise.all([
      fetch(`http://localhost:8080/api/v1/movies/random?type=movies`),
      fetch(`http://localhost:8080/api/v1/series/random`),
      fetch(`http://localhost:8080/api/genres`)
    ]);

    // Check each response
    console.log("randomMovieResponse:", randomMovieResponse);
    console.log("randomSeriesResponse:", randomSeriesResponse);
    console.log("genreListResponse:", genreListResponse);

    if (!randomMovieResponse.ok) {
      console.error("Failed to fetch random movie data");
      throw new Error("Failed to fetch random movie data");
    }
    if (!randomSeriesResponse.ok) {
      console.error("Failed to fetch random series data");
      throw new Error("Failed to fetch random series data");
    }
    if (!genreListResponse.ok) {
      console.error("Failed to fetch genre list");
      throw new Error("Failed to fetch genre list");
    }

    const randomMovie = await randomMovieResponse.json();
    const randomSeries = await randomSeriesResponse.json();
    const genreList = await genreListResponse.json();

    const isMovie = Math.random() < 0.5;
    const selectedData = isMovie ? randomMovie : randomSeries;

    return {
      props: {
        initialPosterData: selectedData,
        genreList,
      },
    };
  } catch (error: any) {
    console.error("Error fetching data:", error.message);
    return {
      props: {
        initialPosterData: null,
        genreList: [],
        error: error.message,
      },
    };
  }
};
