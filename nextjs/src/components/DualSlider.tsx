//ADAPTED FROM 
//https://dev.to/sandra_lewis/building-a-multi-range-slider-in-react-from-scratch-4dl1

import React, { ChangeEvent, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useDispatch } from "react-redux";
import { updateMaxPrice } from '../store/maxPriceSlice';
import classnames from "classnames";




interface DualSliderProps {
	min:number,
	max:number,  
  onChange: (minimum:number, maximum:number) => void,
}

function DualSlider(props: DualSliderProps){
  const dispatch = useDispatch();

  const [minVal, setMinVal] = useState(props.min);
  const [maxVal, setMaxVal] = useState(props.max);
  const [lastSelected, setLastSelected] = useState("min");

  const minValRef = useRef<HTMLInputElement>(null);
  const maxValRef = useRef<HTMLInputElement>(null);
  const range = useRef<HTMLDivElement>(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value: number) => Math.round(((value - props.min) / (props.max - props.min)) * 100),
    [props.min, props.max]
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    if (maxValRef.current) {
      const minPercent = getPercent(minVal);
      const maxPercent = getPercent(+maxValRef.current.value); // Precede with '+' to convert the value from type string to type number

      if (range.current) {
        range.current.style.left = `${minPercent}%`;
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    if (minValRef.current) {
      const minPercent = getPercent(+minValRef.current.value);
      const maxPercent = getPercent(maxVal);

      if (range.current) {
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [maxVal, getPercent]);


  // Get min and max values when their state changes
  useEffect(() => {
    props.onChange(minVal, maxVal);
  }, [minVal, maxVal, props.onChange]);



  return (
    <div className="container">
      <input
        type="range"
        min={props.min}
        max={props.max}
        value={minVal}
        ref={minValRef}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const value = Math.min(+event.target.value, maxVal);
          setMinVal(value);
		  setLastSelected("min")
          event.target.value = value.toString();
        }}
        className={`thumb thumb--zindex-3 ${lastSelected == "min" ? "thumb--zindex-5":null} `}

      />
      <input
        type="range"
        min={props.min}
        max={props.max}
        value={maxVal}
        ref={maxValRef}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const value = Math.max(+event.target.value, minVal);
          setMaxVal(value);
		  setLastSelected("max");
          event.target.value = value.toString();
        }}

        className={`thumb thumb--zindex-3 ${lastSelected == "max" ? "thumb--zindex-5":null} `}
      />

      <div className="slider">
        <div className="slider__track"
                onClick={() => {
                  //here figure out which one to move, if < minvalue, change minvalue, otherwise maxvalue
                }}
        ></div>
        <div ref={range} className="slider__range"
                onClick={() => {
                  //here figure out which one to move, check if minvalue or maxvalue is closer to current point?
                }}
        ></div>

        <div className="slider__left-value">{minVal}</div>
        <div className="slider__right-value">{maxVal}</div>
      </div>
    </div>



  )
}
export default DualSlider;
