import React, { useState } from 'react';
import ExplorePins from '../components/ExplorePins';
import ExploreGroups from '../components/ExploreGroups';
import ExploreArticles from '../components/ExploreArticles';

const ExploreScreen = () => {
  const [activeTab, setActiveTab] = useState('your pins');

  return (
    <div className="container mx-auto p-4">

      <ul className="flex border-b mb-4">
        <li className="mr-4">
          <button
            className={`pb-2 border-b-2 ${activeTab === 'your pins' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500'}`}
            onClick={() => setActiveTab('your pins')}
          >
            Find Pins
          </button>
        </li>
        <li className="mr-4">
          <button
            className={`pb-2 border-b-2 ${activeTab === 'your groups' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500'}`}
            onClick={() => setActiveTab('your groups')}
          >
            Find Groups
          </button>
        </li>
        <li className="ml-4">
          <button
            className={`pb-2 border-b-2 ${activeTab === 'articles' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500'}`}
            onClick={() => setActiveTab('articles')}
          >
            Find Articles
          </button>
        </li>
      </ul>


      <div>
        {activeTab === 'your pins' && <ExplorePins />}
        {activeTab === 'your groups' && <ExploreGroups />}
        {activeTab === 'articles' && <ExploreArticles />}
      </div>
    </div>
  );
};

export default ExploreScreen;
