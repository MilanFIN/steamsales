

import React, { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { updateDiscountLimits } from '../store/discountSlice';
import DualSlider from './DualSlider';




interface DiscountFilterProps {

}

function DiscountFilter(props: DiscountFilterProps){
  const dispatch = useDispatch();


  const discountChange = (min:number, max:number) => {

    dispatch(
      updateDiscountLimits({maxDiscount: max, minDiscount: min})
    );


  }


  return (
    <div >
    
      <DualSlider min={0} max={100} onChange={discountChange}/>

    </div>

  )
}

export default DiscountFilter;
