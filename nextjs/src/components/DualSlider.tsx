//ADAPTED FROM 
//https://dev.to/sandra_lewis/building-a-multi-range-slider-in-react-from-scratch-4dl1

import React, { ChangeEvent, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useDispatch } from "react-redux";




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

  const updateMinVal = (event:any) => {
    if (event.target.value.length == 0) {
      setMinVal(props.min);
      return;
    }
    const value = parseInt(event.target.value);
    
    if (value < props.min) {
      setMinVal(props.min);
    }
    else if (value > maxVal) {
      setMinVal(maxVal);
    }
    else {
      setMinVal(value);
    }
  }

  const updateMaxVal = (event:any) => {
    if (event.target.value.length == 0) {
      setMaxVal(props.max);
      return;
    }
    const value = parseInt(event.target.value);
    
    if (value > props.max) {
      setMaxVal(props.max);
    }
    else if (value < minVal) {
      setMaxVal(minVal);
    }
    else {
      setMaxVal(value);
    }
  }

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
  
    <div className="h-[62px] pt-[10px] ml-6">
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




      <div className="relative w-[300px]">
        <div className={ `absolute w-[300px] mt-[-3px] 
                          h-[5px]
                          bg-gray-600
                          `}
                onClick={() => {
                }}
        ></div>

        <div ref={range} className={`absolute h-[5px] w-[300px] bg-gray-300 z-10 mt-[-3px] rounded`}
                onClick={() => {
                }}
        ></div>

        <input className={`text-white text-center bg-gray-500 
                           text-sm mt-[20px] w-[48px] h-[32px] left-[-16px]
                           absolute rounded`} 
                value={minVal} onChange={updateMinVal}/>
        <input className={`text-white text-center bg-gray-500 
                           text-sm mt-[20px] w-[48px] h-[32px] right-[-16px] 
                           absolute rounded`} 
                value={maxVal == props.max ? "\u221E" : maxVal} onChange={updateMaxVal}/>



      </div>
    </div>



  )
}
export default DualSlider;
