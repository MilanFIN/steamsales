//todo: include free checkbox selection will go here
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateIncludeFree } from "../store/includeFreeSlice";

interface IncludeFreeCheckBoxProps {}

function IncludeFreeCheckBox(props: IncludeFreeCheckBoxProps) {
  const dispatch = useDispatch();

  const [include, setInclude] = useState<boolean>(true);

  const onChangeInclude = (event: React.ChangeEvent<HTMLInputElement>) => {
    var toggledInclude = !include;
    setInclude(toggledInclude);

    dispatch(updateIncludeFree(toggledInclude));
  };

  return (
    <input
      type="checkbox"
      checked={include}
      onChange={onChangeInclude}
      className="ml-3 mr-2 mt-5"
    />
  );
}

export default IncludeFreeCheckBox;
