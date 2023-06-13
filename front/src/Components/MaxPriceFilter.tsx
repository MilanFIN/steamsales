

import React, { useEffect, useState } from 'react';

const STOREURL = "http://asdf.dy.fi:3001/store/"


interface MaxPriceFilterProps {
  updateMaxPrice: (price:number) => void;

}

function MaxPriceFilter(props: MaxPriceFilterProps){

  const [maxPrice, setMaxPrice] = useState<number>(0);


  const onChangeMaxPrice = (event:React.ChangeEvent<HTMLInputElement>) => {
    setMaxPrice(parseInt(event.target.value));
    props.updateMaxPrice(parseInt(event.target.value))
  }


  return (
    <div>
    <input type="range" min={0.0} max={30.0}  className="w-full h-8 " id="maxPriceRange" step={0.5}
    onChange={onChangeMaxPrice} value={maxPrice}></input>

    </div>

  )
}

export default MaxPriceFilter;
