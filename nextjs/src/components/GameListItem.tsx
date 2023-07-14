

import React, { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";


//const STOREURL = "http://localhost:3001/store/"
const STOREURL = "/api/steamstore/"



interface GameListItemProps {
  id: number;
  rank: number;
  viewRank: number;
  currentPlayers: number;
  peakPlayers: number;
  visible: boolean;
  name: string;
  price:string;
  discount:number;
  platforms:Array<string>;
  description:string;
  genres: Array<[number, string]>;
  releaseDate:number;

}

function GameListItem(props: GameListItemProps){

  const [name, setName] = useState<string>("");
  const [free, setFree] = useState(false);
  const [price, setPrice] = useState<string>("");
  const [priceCents, setPriceCents] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [platforms, setPlatforms] = useState<Array<string>>([]);
  const [visible, setVisible] = useState(true);

  const dispatch = useDispatch();


  return (
    <div className="bg-gray-600 m-2 text-white text-lg overflow-y-hidden rounded pt-2 pb-2">     
          
          
          <div className="flex">
            <h1 className="ml-4 w-8 top-4 relative font-bold">{props.viewRank}</h1>

          <div className="md:flex md:flex-row">

            <a className="flex-shrink-0 mt-2" href={"https://store.steampowered.com/app/"+props.id}>
              <img className="w-[72] h-auto"
                src={"https://cdn.cloudflare.steamstatic.com/steam/apps/"+props.id+"/capsule_231x87.jpg"} alt={"game: "+props.name+" thumbnail"} />
            </a>

            <div className="ml-4">
                {props.name}
                <br/>
                Players online:  
                {" " + props.currentPlayers}
                <br/>

                <div className="flex">
                
                {props.price == "0" ? 
                  <span>Free</span>: <span>{props.price}</span>
                }
                
                {props.discount != 0 ? 
                          <div className='bg-lime-800 text-lime-300 text-xl font-semibold w-fit ml-2 p-1 rounded-md'>-{props.discount} %</div>
                      : null
                }

              </div>
              <div className="">
                Released: {(new Date(props.releaseDate)).toLocaleDateString()}
              </div>

              <div className="flex overflow-x-scroll">
                  {props.platforms.map(platform => (
                    //https://store.cloudflare.steamstatic.com/public/images/v6/icon_platform_win.png?v=3
                    //`https://store.cloudflare.steamstatic.com/public/images/v6/icon_platform_${platform}_dark.png`}
                      <img className="w-8 h-8" key={platform+props.id} src={`https://store.cloudflare.steamstatic.com/public/images/v6/icon_platform_${platform}.png?v=3`} alt={"icon for platform: "+platform}/>
                    ))
                  }
                  {props.genres.slice(0,5).map(genre => (
                    <div>
                    {genre[1].length < 15 ? 
                      <div className="bg-gray-500 rounded-lg ml-1 mr-1 pl-2 pr-2"><a href={"https://store.steampowered.com/tags/en/"+genre[1]}>{genre[1]}</a></div>
                    : null}
                    </div>
                              
                  ))
                  }
              </div>
          </div>
          
          </div>


      </div>

     </div>

  )
}
/*
          
{platforms.length > 0 && (
              <span>Platforms: {platforms.join(', ')}</span>
            )}
*/
export default GameListItem;
