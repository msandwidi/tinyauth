import "./404.css";
import React from "react";
import Wrapper from "../PageWrapper";

const PageNotFound = () => {
  const renderPageNotFound = () => {
    return <div>The resource you are looking for cannot be found</div>;
  };

  return (
    <Wrapper title="404" subtitle="Page Not Found">
      {renderPageNotFound()}
    </Wrapper>
  );
};

export default PageNotFound;
