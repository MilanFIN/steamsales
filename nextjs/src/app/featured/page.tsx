"use client";
import "../globals.css";

import { Inter } from "next/font/google";

import { useEffect, useState } from "react";
import { Game } from "@/common/interfaces";
import { getAppDetails, getFeatured, getTop100 } from "@/app/actions";
import ListingPage from "@/components/ListingPage";

const inter = Inter({ subsets: ["latin"] });

const Featured = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [loaded, setLoaded] = useState<boolean>(false);

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
                        let gameObj = await getAppDetails(id);

                        newGame.name = gameObj.name;
                        newGame.description = gameObj.detailed_description;

                        gameObj.genres.forEach((genreList: any) => {
                            let genre: [number, string];
                            genre = [
                                parseInt(genreList.id),
                                genreList.description,
                            ];
                            newGame.genres.push(genre);
                        });

                        const rawPlatforms = Object.keys(
                            gameObj.platforms
                        ).filter((key) => gameObj.platforms[key] === true);
                        var gamePlatforms = Array<string>();
                        rawPlatforms.forEach((platform) => {
                            if (platform === "windows") {
                                platform = "win";
                            }
                            gamePlatforms.push(platform);
                        });

                        newGame.platforms = gamePlatforms;

                        newGame.releaseDate = Date.parse(
                            gameObj.release_date.date
                        );

                        if (!gameObj.is_free) {
                            if (gameObj.price_overview == null) {
                                newGame.priceFormatted = "Price data missing";
                            } else {
                                newGame.priceFormatted =
                                    gameObj.price_overview.final_formatted;
                                newGame.priceCents =
                                    gameObj.price_overview.final;
                                newGame.discount =
                                    gameObj.price_overview.discount_percent;
                            }
                        }
                        setGames((games) => [...games, newGame]);
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
