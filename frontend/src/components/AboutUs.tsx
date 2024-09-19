import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <div className="mr-4 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-center">About Us</h1>
      <p className="text-lg mb-6">
        Welcome to Lookout, a cutting-edge Progressive Web App (PWA) designed to enhance how we record and share points of interest in nature. Our application addresses the needs of animal spotters, hikers, and conservationists by offering a modern and efficient way to document and disseminate important information.
      </p>
      <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
      <p className="text-lg mb-6">
        At Lookout, our mission is to provide a seamless platform for users to geo-tag and share significant locations such as animal sightings, camping spots, and security concerns. We aim to bridge the gap between outdated technologies and the current need for effective location-based reporting.
      </p>
      <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
      <ul className="list-disc list-inside mb-6">
        <li className="text-lg mb-2">A PWA that users can download and access on their native mobile devices.</li>
        <li className="text-lg mb-2">The ability to sign in with Gmail for easy access and management.</li>
        <li className="text-lg mb-2">Features to capture and share photos of points of interest along with their geographical location.</li>
        <li className="text-lg mb-2">A geographical map showcasing various categories of animal sightings, hiking trails, points of interest, camping sites and security concerns.</li>
        <li className="text-lg mb-2">Functionality to create, search, join, and manage groups for collaborative exploration and reporting.</li>
        <li className="text-lg mb-2">Offline accessibility by saving posts locally and syncing them once an internet connection is available.</li>
      </ul>
      <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
      <p className="text-lg mb-8">
        We envision Lookout as a revolutionary tool that brings together communities of nature enthusiasts, hikers, and conservationists. By integrating modern technology with intuitive design, we strive to empower our users to share their discoveries and concerns effectively, ultimately enhancing the safety and enjoyment of outdoor activities.
      </p>
    </div>
  );
};

export default AboutUs;
