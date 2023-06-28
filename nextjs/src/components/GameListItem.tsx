

import React, { useEffect, useState } from 'react';
import gameInfoSlice, { updateGameInfo, gameInfoState } from '../store/gameInfoSlice';
import { useDispatch } from "react-redux";


//const STOREURL = "http://localhost:3001/store/"
const STOREURL = "/api/steamstore/"



interface GameListItemProps {
  id: number;
  rank: number;
  viewRank: number;
  currentPlayers: number;
  peakPlayers: number;
  maxPrice: number;
  minDiscount: number;
  visible: boolean;

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

  useEffect(()=>{

    
    const fetchData = async () => {
      try {
        const response = await fetch(STOREURL + "?path=api/appdetails?appids="+props.id);
        const jsonData = await response.json();

        var [gameObj]:any  = Object.values(jsonData);
        gameObj = gameObj.data;

        setName(gameObj.name)

        const rawPlatforms = Object.keys(gameObj.platforms).filter(key => gameObj.platforms[key] === true);
        var gamePlatforms = Array<string>();
        rawPlatforms.forEach(platform => {
          if (platform === "windows") {
            platform = "win"
          }
          gamePlatforms.push(platform)
        });

        setPlatforms(gamePlatforms)

        var parsedGameData = {
          price:0,
          discount:0,
          rank:props.rank
        } as gameInfoState;



        if (!gameObj.is_free) {
          setPrice(gameObj.price_overview.final_formatted)
          setPriceCents(gameObj.price_overview.final)
          parsedGameData.price = gameObj.price_overview.final;
          setDiscount(parseInt(gameObj.price_overview.discount_percent))
          parsedGameData.discount = gameObj.price_overview.discount_percent;
        }
        else {
          setFree(true)
          setPrice("Free")
        }


        dispatch(
          updateGameInfo(parsedGameData)
        );

      } catch (error) {
        //console.log(STOREURL + "api/appdetails?appids="+props.id)
        //console.log(gameObj.name)
        setPrice("?")
        //console.error('Error:', error, );
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    if ((priceCents <= props.maxPrice*100 || props.maxPrice === 0)
      &&  (discount >= props.minDiscount || props.minDiscount === 0)) {
      setVisible(true)
    }
    else {
      setVisible(false)
    }
  }, [props.maxPrice, props.minDiscount]);



  return (
    <div>     
      {props.visible? 
          <div>
          
          <img src={"https://cdn.cloudflare.steamstatic.com/steam/apps/"+props.id+"/capsule_231x87.jpg"} alt={"game: "+props.id+" thumbnail"} />
          <br/>
          
          {props.viewRank}, {props.rank}: {name}
          <br/>
          Current: 
          {props.currentPlayers}
          <br/>
          Price: {price}
          <span>, Discount: {discount} %</span>
          

            {platforms.map(platform => (
                <img key={platform+props.id} src={`https://store.cloudflare.steamstatic.com/public/images/v6/icon_platform_${platform}_dark.png`} alt={"icon for platform: "+platform}/>
              ))
            }
            <br/>
            Max price: {props.maxPrice}
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
