import Link from 'next/link';
// import Image from 'next/image';
import React from 'react';
import './fundme.css';

const FundraisersGrid = () => {
  // Fundraiser data with diverse Pexels images
  const fundraisers = [
    {
      id: 1,
      title: 'Rebuild Our Home Lost in a Wildfire',
      description: 'A wildfire destroyed our home and all our belongings. We are raising money to rebuild and get back on our feet.',
      imageUrl: 'https://images.pexels.com/photos/948270/pexels-photo-948270.jpeg?auto=compress&cs=tinysrgb&w=800',
      goal: 50000,
      raised: 12500,
    },
    {
      id: 2,
      title: 'Flood Relief for Our Community',
      description: 'Our town was devastated by a recent flood. We are raising funds to provide food, water, and shelter to those affected.',
      imageUrl: 'https://images.pexels.com/photos/709542/pexels-photo-709542.jpeg?auto=compress&cs=tinysrgb&w=800',
      goal: 100000,
      raised: 45000,
    },
    {
      id: 3,
      title: 'Help Us Recover from the Hurricane',
      description: 'A hurricane destroyed our small business. We are raising money to repair the damage and reopen our doors.',
      imageUrl: 'https://images.pexels.com/photos/753619/pexels-photo-753619.jpeg?auto=compress&cs=tinysrgb&w=800',
      goal: 25000,
      raised: 5000,
    },
    {
        id: 4,
        title: 'Tornado Recovery for the Smith Family',
        description: 'The Smith family lost everything in a tornado. We are raising funds to help them rebuild their lives.',
      imageUrl: 'https://images.pexels.com/photos/1119974/pexels-photo-1119974.jpeg?auto=compress&cs=tinysrgb&w=800',
        goal: 75000,
        raised: 32000,
    },
    {
        id: 5,
        title: 'Earthquake Relief for a Small Village',
        description: 'A recent earthquake has left a small village in ruins. We are raising funds to provide emergency supplies and support.',
      imageUrl: 'https://images.pexels.com/photos/7806169/pexels-photo-7806169.jpeg?auto=compress&cs=tinysrgb&w=800',
        goal: 200000,
        raised: 95000,
    },
    {
        id: 6,
        title: 'Support for Farmers Affected by Drought',
        description: 'A severe drought has devastated local farms. We are raising funds to help farmers and their families.',
      imageUrl: 'https://images.pexels.com/photos/60013/desert-drought-dehydrated-clay-soil-60013.jpeg?auto=compress&cs=tinysrgb&w=800',
        goal: 60000,
        raised: 15000,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {fundraisers.map((fundraiser) => (
        <div key={fundraiser.id} className="bg-gray-800 bg-opacity-50 rounded-lg shadow-lg overflow-hidden backdrop-blur-sm border border-gray-700">
          <img 
            src={fundraiser.imageUrl} 
            alt={fundraiser.title} 
            className="w-full h-48 object-cover"
            width={400}
            height={192}
          />
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2 text-white">{fundraiser.title}</h3>
            <p className="text-gray-300 mb-4">{fundraiser.description}</p>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400">Raised</p>
                <p className="text-2xl font-bold text-white">${fundraiser.raised.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400">Goal</p>
                <p className="text-2xl font-bold text-white">${fundraiser.goal.toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="bg-gray-700 rounded-full h-2">
                <div
                  className="progress-bar"
                  style={{ width: `${(fundraiser.raised / fundraiser.goal) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="mt-6">
              <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:from-cyan-600 hover:to-blue-600">
                Donate Now
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};


const FundMePage = () => {
  return (
    <div className="bg-gradient-to-br from-blue-900 to-cyan-900 min-h-screen">
      <div className="relative bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative pt-16 pb-20 sm:pt-24 sm:pb-28">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                <span className="block">Successful fundraisers</span>
                <span className="block text-cyan-400">start here</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Get started in just a few minutes — with helpful new tools, it&apos;s easier than ever to pick the perfect title, write a compelling story, and share it with the world.
              </p>
              <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <div className="rounded-md shadow">
                  <Link href="/fundme/new" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 md:py-4 md:text-lg md:px-10">
                    Start a Fundraiser
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Fundraisers for those in need
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Browse and support fundraisers started by people affected by natural disasters.
            </p>
          </div>
          <div className="mt-12">
            <FundraisersGrid />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundMePage;
