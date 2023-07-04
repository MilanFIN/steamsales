

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
    <div>     
      {props.visible? 
          <div>
          
          <img src={"https://cdn.cloudflare.steamstatic.com/steam/apps/"+props.id+"/capsule_231x87.jpg"} alt={"game: "+props.id+" thumbnail"} />
          <br/>
          
          {props.viewRank}: {props.name}
          <br/>
          Current: 
          {props.currentPlayers}
          <br/>
          Price: {props.price}
          <span>, Discount: {props.discount} %</span>
          

            {props.platforms.map(platform => (
                <img key={platform+props.id} src={`https://store.cloudflare.steamstatic.com/public/images/v6/icon_platform_${platform}_dark.png`} alt={"icon for platform: "+platform}/>
              ))
            }
            <br/>
            </div>
      : null
          }

     </div>

  )
}
/*
          
{platforms.length > 0 && (
              <span>Platforms: {platforms.join(', ')}</span>
            )}
*/
export default GameListItem;
