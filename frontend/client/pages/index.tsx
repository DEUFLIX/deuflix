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

interface IProps {
  posterData: Movie | Series | null;
  genreList: Genre[];
  error?: string;
}

const Home = ({ posterData, genreList, error }: IProps) => {
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

  return (
      <div className="relative h-screen bg-gradient-to-b from-gray-900/10 to-[#010511] lg:h-[95vh]">
        <Head>
          <title>NetFlix{currentType === "" ? "" : "-" + currentType}</title>
        </Head>
        <Navbar />
        <main className="relative pb-10 pl-4 lg:pl-10">
          <Poster posterData={posterData} genreList={genreList} />
          <section className="md:space-y-10 mt-12">
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

    // Log the data
    console.log("Random movie data:", randomMovie);
    console.log("Random series data:", randomSeries);
    console.log("Genre list data:", genreList);

    const isMovie = Math.random() < 0.5;
    const selectedData = isMovie ? randomMovie : randomSeries;

    return {
      props: {
        posterData: selectedData,
        genreList,
      },
    };
  } catch (error: any) {
    console.error("Error fetching data:", error.message);
    return {
      props: {
        posterData: null,
        genreList: [],
        error: error.message,
      },
    };
  }
};
