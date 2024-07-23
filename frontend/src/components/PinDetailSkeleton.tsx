import React from "react";
import SkeletonElement from "./SkeletonElement"; // Ensure the correct path is used

const SkeletonPinDetail: React.FC = () => {
  return (
    <div className="skeleton-wrapper">
      <style>
        {`
        .skeleton-wrapper {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        }

        .skeleton {
        background: #ddd;
        border-radius: 4px;
        margin: 0.5rem 0;
        }

        .skeleton.thumbnail {
        width: 60%;
        height: 200px;
        }

        .skeleton.title {
        width: 60%;
        height: 20px;
        }

        .skeleton.text {
        width: 60%;
        height: 14px;
        }
        
        .skeleton-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        }

        .skeleton-content {
        display: flex;
        justify-content: center;
        align-items: center;
        }

        `}
      </style>
      <div className="skeleton-header">
        <SkeletonElement type="title" />
        <SkeletonElement type="thumbnail" />
        <SkeletonElement type="text" />
        <SkeletonElement type="text" />
        <SkeletonElement type="text" />
      </div>
    </div>
  );
};

export default SkeletonPinDetail;
