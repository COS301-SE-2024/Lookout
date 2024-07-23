import React from "react";

interface SkeletonElementProps {
  type: "thumbnail" | "title" | "text" | "map";
}

const SkeletonElement: React.FC<SkeletonElementProps> = ({ type }) => {
  const classes = `skeleton ${type}`;
  return <div className={classes}></div>;
};

export default SkeletonElement;
