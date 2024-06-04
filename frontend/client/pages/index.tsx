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
  posterData: Movie | Series;
  genreList: Genre[];
}

const Home = ({ posterData, genreList }: IProps) => {
  const [liste, setListe] = useState<List[]>([]);
  const currentGenre = useContext(GenreContext);
  const router = useRouter();
  const currentType = router.asPath.substring(1);
  const state = useContext(UserContext);

  useEffect(() => {
    const getListe = async () => {
      try {
        const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API}/lists/genre/?type=${currentType}&genre=${currentGenre?.currentGenre}`
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
      fetch(`${process.env.NEXT_PUBLIC_API}/movies/random?type=movies`),
      fetch(`${process.env.NEXT_PUBLIC_API}/series/random`),
      fetch(`${process.env.NEXT_PUBLIC_API}/genre`)
    ]);

    const randomMovie = await randomMovieResponse.json();
    const randomSeries = await randomSeriesResponse.json();
    const genreList = await genreListResponse.json();

    const isMovie = Math.random() < 0.5; // 50% 확률로 movie 또는 series 선택
    const selectedData = isMovie ? randomMovie : randomSeries;

    const suggestionsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API}/getSuggestions?${isMovie ? 'movieId' : 'seriesId'}=${selectedData.id}`
    );

    const suggestionsData = await suggestionsResponse.json();

    return {
      props: {
        posterData: { ...selectedData, ...suggestionsData },
        genreList,
      },
    };
  } catch (error: any) {
    console.error("Error fetching data:", error);
    return {
      props: {
        posterData: null,
        genreList: [],
        error: error.message,
      },
    };
  }
};
