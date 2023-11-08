"use_server";
import "../app/globals.css";

import { Inter } from "next/font/google";

import { store } from "../store/store";
import { Provider } from "react-redux";

import ListingPage from "@/components/ListingPage";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Game } from "@/common/interfaces";
import { getGame } from "@/common/apigetters";

//const APIURL = "http://localhost:3001/api/"
const FEATUREDURL = "/api/featured/";
const STOREURL = "/api/steamapi/";

const Featured = () => {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(FEATUREDURL);

      const featuredJson = await response.json();
      let rank = 0;

      let gameIds: number[] = [];

      Object.keys(featuredJson).forEach((category: string) => {
        let isnum = /^\d+$/.test(category);
        if (!isnum) {
          if (featuredJson[category].hasOwnProperty("items")) {
            featuredJson[category].items.forEach((game: any) => {
              //console.log(game)
              gameIds.push(game.id);
            });
          }
        }
      });

      gameIds.forEach(async (id: number, rank) => {
        let newGame: Game = {
          name: "",
          id: id,
          rank: rank + 1,
          viewRank: rank + 1,
          currentPlayers: -1,
          peakPlayers: -1,
          priceFormatted: "0",
          priceCents: 0,
          discount: 0,
          visible: true,
          platforms: [],
          description: "",
          genres: [],
          releaseDate: 0,
        };
        newGame = await getGame(newGame);

        let duplicate = false;
        games.forEach((game) => {
          if (game.id == id) {
            duplicate = true;
          }
        });
        if (!duplicate) {
          setGames((games) => filterDuplicates([...games, newGame]));
        }
      });

      const filterDuplicates = (gameList: any) => {
        gameList = gameList
          .filter(
            (v: any, i: any, a: any) =>
              a.findIndex((v2: any) => v2.id === v.id) === i
          )
          .sort((a: any, b: any) => b.discount - a.discount);
        gameList.forEach((element: any, i: number) => {
          element.viewRank = i + 1;
        });
        return gameList;
      };
    };

    fetchData();
  }, []);

  return (
    <Provider store={store}>
      <div className="">
        <ListingPage games={games} enablePlayerCountFilter={false} />
      </div>
    </Provider>
  );
};

export default Featured;

/*

*/
