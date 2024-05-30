import React from 'react';
import { FaChevronRight } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/styles/profile.css';

const GroupsList = ({ groups }: { groups: { owner: string, name: string, description: string }[] }) => {
  return (
    <div className="container">
      {groups.map((group, index) => (
        <div
          key={index}
          className="d-flex align-items-center justify-content-between mb-4 p-2 border border-secondary rounded group-item"
          onClick={() => alert(`Clicked on ${group.name}`)}
        >
          <div>
            <h3>{group.name}</h3>
            <p>{group.description}</p>
          </div>
          <button
            className="btn d-flex align-items-center"
            style={{ backgroundColor: 'transparent', border: 'none' }}
          >
            <FaChevronRight />
          </button>
        </div>
      ))}
    </div>
  );
};

export default GroupsList;
