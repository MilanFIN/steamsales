import { useEffect, useRef } from "react";

//const STOREURL = "http://localhost:3001/store/"
const STOREURL = "/api/steamstore/";

interface GameListItemProps {
    id: number;
    rank: number;
    viewRank: number;
    currentPlayers: number;
    peakPlayers: number;
    visible: boolean;
    name: string;
    price: string;
    discount: number;
    platforms: Array<string>;
    description: string;
    genres: Array<[number, string]>;
    releaseDate: number;
    active: boolean;
    clicked: (id: number) => void;
    activeItem: number;
}

function GameListItem(props: GameListItemProps) {
    const focusRef = useRef<HTMLDivElement>(null);

    const openDetails = () => {
        if (props.id != props.activeItem) {
            props.clicked(props.id);
        } else {
            props.clicked(-1);
        }
    };

    useEffect(() => {
        if (props.active) {
            if (focusRef.current != null) {
                focusRef.current.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [props.active]);

    const numberWithSpaces = function (x: number) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    return (
        <div
            className="bg-gray-600 m-2 text-white text-lg overflow-y-hidden
                   rounded pt-2 pb-2 cursor-pointer"
            onClick={openDetails}
            ref={focusRef}
        >
            <div className="flex grow">
                <div className="lg:flex lg:flex-row">
                    <div className="flex-shrink-0 mt-2">
                        <img
                            className="ml-4 w-[72] h-auto"
                            src={
                                "https://cdn.cloudflare.steamstatic.com/steam/apps/" +
                                props.id +
                                "/capsule_231x87.jpg"
                            }
                            alt={"game: " + props.name + " thumbnail"}
                        />
                    </div>

                    <div className="ml-4 ">
                        {props.name}
                        <br />
                        {props.currentPlayers > 0 ? (
                            <span>
                                Players online:
                                {" " + numberWithSpaces(props.currentPlayers)}
                                <br />
                            </span>
                        ) : null}
                        <div className="flex">
                            {props.price == "0" ? (
                                <span>Free</span>
                            ) : (
                                <span>{props.price}</span>
                            )}

                            {props.discount != 0 ? (
                                <div className="bg-lime-800 text-lime-300 text-xl font-semibold w-fit ml-2 p-1 rounded-md">
                                    -{props.discount} %
                                </div>
                            ) : null}
                        </div>
                        <div className="">
                            Released:{" "}
                            {new Date(props.releaseDate).toLocaleDateString()}
                        </div>
                        <div className="flex overflow-x-hidden">
                            {props.platforms.map((platform) => (
                                //https://store.cloudflare.steamstatic.com/public/images/v6/icon_platform_win.png?v=3
                                //`https://store.cloudflare.steamstatic.com/public/images/v6/icon_platform_${platform}_dark.png`}
                                <img
                                    className="w-8 h-8"
                                    key={platform + props.id}
                                    src={`https://store.cloudflare.steamstatic.com/public/images/v6/icon_platform_${platform}.png?v=3`}
                                    alt={"icon for platform: " + platform}
                                />
                            ))}
                            {props.genres.slice(0, 5).map((genre) => (
                                <div key={genre[0]}>
                                    {genre[1].length < 15 ? (
                                        <div className="bg-gray-500 rounded-lg ml-1 mr-1 pl-2 pr-2">
                                            <a
                                                href={
                                                    "https://store.steampowered.com/tags/en/" +
                                                    genre[1]
                                                }
                                            >
                                                {genre[1]}
                                            </a>
                                        </div>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                        {props.active ? (
                            <div>
                                <p
                                    dangerouslySetInnerHTML={{
                                        __html: props.description,
                                    }}
                                ></p>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}
/*
          
{platforms.length > 0 && (
              <span>Platforms: {platforms.join(', ')}</span>
            )}
*/
export default GameListItem;
