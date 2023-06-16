

import React, { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { updateDiscount } from '../store/discountSlice';




interface DiscountFilterProps {

}

function MaxPriceFilter(props: DiscountFilterProps){
  const dispatch = useDispatch();


  const [discount, setDiscount] = useState<number>(0);


  const onChangeDiscount = (event:React.ChangeEvent<HTMLInputElement>) => {
    setDiscount(parseInt(event.target.value));
    //props.updateMaxPrice(parseInt(event.target.value))

    dispatch(
      updateDiscount(parseInt(event.target.value))
    );


  }


  return (
    <div>
    <input type="range" min={0.0} max={100.0}  className="w-full h-8 " id="maxPriceRange" step={1}
    onChange={onChangeDiscount} value={discount}></input>

    </div>

  )
}

export default MaxPriceFilter;
