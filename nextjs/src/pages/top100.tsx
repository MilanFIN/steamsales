"use_client";
import "../app/globals.css";

import { Inter } from "next/font/google";

import { store } from "../store/store";
import { Provider } from "react-redux";

import ListingPage from "@/components/ListingPage";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Game } from "@/interfaces/interfaces";

const inter = Inter({ subsets: ["latin"] });

//const APIURL = "http://localhost:3001/api/"
const APIURL = "/api/steamapi/";
const STOREURL = "/api/steamapi/"; //"/api/steamstore/"

const Top100 = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      console.log(loaded)
      if (loaded) {
        return;
      }

      try {
        const response = await fetch(
          APIURL +
            "?subdomain=api&lang=english&currency=1&path=ISteamChartsService/GetGamesByConcurrentPlayers/v1/"
        );
        const jsonData = await response.json();

        const gameList = jsonData.response.ranks;

        //TODO: temporary restriction to prevent flooding spamming servers accidentally
        //const gameList = jsonData.response.ranks.slice(0, 50)

        gameList.forEach(async (game: any) => {
          //

          let newGame: Game = {
            name: "",
            id: game.appid,
            rank: game.rank,
            viewRank: game.rank,
            currentPlayers: game.concurrent_in_game,
            peakPlayers: game.peak_in_game,
            priceFormatted: "0",
            priceCents: 0,
            discount: 0,
            visible: false,
            platforms: [],
            description: "",
            genres: [],
            releaseDate: 0,
          };

          try {
            const url =
              STOREURL +
              "?subdomain=store&lang=english&currency=1&path=api/appdetails?appids=" +
              game.appid;
            const gameSpecResponse = await fetch(url);
            const gameJson = await gameSpecResponse.json();

            var [gameObj]: any = Object.values(gameJson);
            gameObj = gameObj.data;
            newGame.name = gameObj.name;
            newGame.description = gameObj.detailed_description; //about_the_game //short_description

            gameObj.genres.forEach((genreList: any) => {
              let genre: [number, string];
              genre = [parseInt(genreList.id), genreList.description];
              newGame.genres.push(genre);
            });

            const rawPlatforms = Object.keys(gameObj.platforms).filter(
              (key) => gameObj.platforms[key] === true
            );
            var gamePlatforms = Array<string>();
            rawPlatforms.forEach((platform) => {
              if (platform === "windows") {
                platform = "win";
              }
              gamePlatforms.push(platform);
            });

            newGame.platforms = gamePlatforms;

            newGame.releaseDate = Date.parse(gameObj.release_date.date);

            if (!gameObj.is_free) {
              if (gameObj.price_overview == null) {
                newGame.priceFormatted = "Price data missing";
              } else {
                newGame.priceFormatted = gameObj.price_overview.final_formatted;
                newGame.priceCents = gameObj.price_overview.final;
                newGame.discount = gameObj.price_overview.discount_percent;
              }
            }
          } catch (err) {}
          newGame.visible = true;
          setGames((games) => [...games, newGame]);
        });
        setLoaded(true);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Provider store={store}>
      <div className="">
        <ListingPage games={games} />
      </div>
    </Provider>
  );
};

export default Top100;

/*

*/
