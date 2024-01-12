"use client";
import "../globals.css";

import { Inter } from "next/font/google";

import { useEffect, useRef, useState } from "react";
import { Game } from "@/common/interfaces";
import { getAppDetails, getTop100 } from "@/app/actions";
import ListingPage from "@/components/ListingPage";
import { parseGameDetails } from "@/common/utils";

const inter = Inter({ subsets: ["latin"] });

//const APIURL = "http://localhost:3001/api/"
const APIURL = "/api/steamapi/";
const STOREURL = "/api/steamapi/"; //"/api/steamstore/"

const Top100 = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [loaded, setLoaded] = useState<boolean>(false);

    const gamesRef = useRef<Game[]>();
    gamesRef.current = games;


    useEffect(() => {
        const fetchData = async () => {
            if (loaded) {
                return;
            }

            try {
                setLoaded(true);

                const top100 = await getTop100();

                top100.forEach(async (game: any) => {

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
                        getAppDetails(game.appid).then(gameObj => {
                            newGame = parseGameDetails(newGame, gameObj);

                            if (!gamesRef.current!.some((game: Game) => game.id == newGame.id)) {
                                setGames((games) => [...games, newGame]);
                            }
                        });

                    } catch (e) {}
                });

                setLoaded(true);
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="">
            <ListingPage games={games} enablePlayerCountFilter={true} />
        </div>
    );
};

export default Top100;

/*

*/
