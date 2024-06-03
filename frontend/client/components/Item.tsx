import Image from "next/image";
import React, { useContext } from "react";
import { Movie, Series } from "../typing";
import { MdAdd, MdDelete, MdPlayCircle, MdRemove } from "react-icons/md";
import Link from "next/link";
import BasicModal from "./Modal";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { IUser } from "../pages/userList";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface IProps {
  item: Movie | Series;
  setControl?: React.Dispatch<React.SetStateAction<number>>;
}

const Item: React.FC<IProps> = ({ item, setControl }) => {
  const user = useContext(UserContext);

  const addToList = async () => {
    try {
      await axios.patch(
          `${process.env.NEXT_PUBLIC_API}/users/${user?.state?.id}/movie-list/${item.id}`
      );
      toast.success("Item added to list ");
    } catch (error) {
      console.log(error);
    }
  };

  const removeFromList = async () => {
    try {
      await axios.patch(
          `${process.env.NEXT_PUBLIC_API}/users/${user?.state?.id}/movie-list-remove/${item.id}`
      );
      setControl ? setControl(1) : "";
    } catch (error) {
      console.log(error);
    }
  };

  return (
      <div className="relative h-28 min-w-[180px] transition duration-300 ease-out md:h-36 md:min-w-[260px] md:hover:scale-125 md:hover:z-20">
        <img
            src={'movieImage' in item ? item.movieImage : item.thumbnailImage}
            className="rounded-sm object-cover md:rounded w-full h-[140px] px-1 block"
        />
        <div className="absolute top-0 left-0 w-full h-full hover:bg-black/80 opacity-10 hover:opacity-100 text-white">
          <div className="white-space-normal text-xs md:text-sm font-bold flex flex-col justify-center items-center py-5 px-6 mt-3">
            {item?.title}
            <div className="flex text-2xl mt-3 ml-10 cursor-pointer">
              <Link href="">
                <a>
                  <MdPlayCircle className="mr-3" />
                </a>
              </Link>
              {setControl ? (
                  <MdDelete className="text-ml mx-4 mr-8" onClick={removeFromList} />
              ) : (
                  <MdAdd onClick={addToList} className="text-ml mx-4 mr-8" />
              )}
              <BasicModal movie={item} />
            </div>
          </div>
        </div>
      </div>
  );
};

export default Item;
