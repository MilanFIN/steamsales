"use client";
import "../globals.css";

import { Inter } from "next/font/google";

import { useEffect, useRef, useState } from "react";
import { Game } from "@/common/interfaces";
import { getAppDetails, getFeatured, getTop100 } from "@/app/actions";
import ListingPage from "@/components/ListingPage";
import { parseGameDetails } from "@/common/utils";

const inter = Inter({ subsets: ["latin"] });

const Featured = () => {
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
                const featured = await getFeatured();
                let rank = 0;

                let gameIds: number[] = [];

                Object.keys(featured).forEach((category: string) => {
                    let isnum = /^\d+$/.test(category);
                    if (!isnum) {
                        if (featured[category].hasOwnProperty("items")) {
                            featured[category].items.forEach((game: any) => {
                                gameIds.push(game.id);
                            });
                        }
                    }
                });

                gameIds.forEach(async (id: any) => {
                    let newGame: Game = {
                        name: "",
                        id: id,
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

                    rank++;
                    try {
                        getAppDetails(id).then(gameObj => {

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
            <ListingPage games={games} enablePlayerCountFilter={false} />
        </div>
    );
};

export default Featured;

/*

*/
