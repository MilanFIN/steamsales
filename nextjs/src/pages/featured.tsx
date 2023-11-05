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

      Object.keys(featuredJson).forEach((category:string) => {
        let isnum = /^\d+$/.test(category);
        if (!isnum) {
          if (featuredJson[category].hasOwnProperty("items")) {
            featuredJson[category].items.forEach( (game: any) => {
              //console.log(game)
              gameIds.push(game.id);
            })
  
          }
        }
      })

      gameIds.forEach(async (id:number, rank) => {
        let newGame: Game = {
          name: "",
          id: id,
          rank: rank+1,
          viewRank: rank+1,
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
        newGame = await getGame(newGame)

        let duplicate = false;
        games.forEach(game => {
          if (game.id == id) {
            duplicate = true;
          }
        })
        if (!duplicate) {
          setGames((games) => [...games, newGame]);

        }

      });



/*


              let newGame: Game = {
                name: "",
                id: game.id,
                rank: rank,
                viewRank: rank,
                currentPlayers: 0,
                peakPlayers: 0,
                priceFormatted: "0",
                priceCents: 0,
                discount: 0,
                visible: false,
                platforms: [],
                description: "",
                genres: [],
                releaseDate: 0,
              };

              newGame = await getGame(newGame);
    
              //console.log(newGame)
              rank++
              setGames((games) => [...games, newGame]);
              console.log([...games, newGame])

*/


      //setGames(gameList);

      /*
      const platforms = ["featured_linux", "featured_win", "featured_mac"];

      let gameList: Game[] = [];

      let rank = 0;
      platforms.forEach((platform) => {
        const content = featuredJson[platform];
        console.log(content);
        content.forEach(
          (element: {
            id: any;
            name: any;
            discount_percent: any;
            final_price: any;
          }) => {
            let newGame: Game = {
              id: element.id,
              name: element.name,
              discount: element.discount_percent,
              priceCents: element.final_price,
              platforms: ["win"],
              //following are missing currently
              description: "",
              viewRank: rank,
              rank: rank,
              currentPlayers: 0,
              peakPlayers: 0,
              priceFormatted: (element.final_price / 100).toString(),
              visible: true,
              genres: [],
              releaseDate: 0,
            };

            let duplicate = false;

            gameList.forEach((game) => {
              if (game.id == element.id) {
                duplicate = true;
              }
            });
            if (!duplicate) {
              gameList.push(newGame);
              rank++;
            }
          }
        );
      });

      setGames(gameList);
      */

      /*
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

      */

      /*
      try {
        let gameList = [{
          appid: 949230,
          concurrent_in_game: 24109,
          peak_in_game: 43510,
          rank: 29
        }]


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
          */
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

export default Featured;

/*

*/
