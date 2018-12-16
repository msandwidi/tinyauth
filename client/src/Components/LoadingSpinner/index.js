import "./Loading.css";
import React from "react";
import { RingLoader } from "react-spinners";

const Loading = props => {
  return (
    <div className="centered d-flex justify-content-center">
      <RingLoader color={"#123abc"} loading={props.isLoading}  />
    </div>
  );
};

export default Loading;
