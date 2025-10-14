import React from 'react';
import { FaTruck, FaRegCreditCard, FaAward } from 'react-icons/fa';
import { GiReturnArrow } from 'react-icons/gi';

const features = [
  {
    id: 1,
    icon: <FaTruck className="text-blue-600 h-8 w-8" />,
    title: 'Fast Delivery all across the country',
  },
  {
    id: 2,
    icon: <FaRegCreditCard className="text-blue-600 h-8 w-8" />,
    title: 'Safe Payment',
  },
  {
    id: 3,
    icon: <GiReturnArrow className="text-blue-600 h-8 w-8" />,
    title: '7 Days Return Policy',
  },
  {
    id: 4,
    icon: <FaAward className="text-blue-600 h-8 w-8" />,
    title: '100% Authentic Products',
  },
];

const Sponsored = () => {
  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-4">
        {features.map(({ id, icon, title }) => (
          <FeatureCard key={id} icon={icon} title={title} />
        ))}
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title }) => (
  <div className="flex flex-col items-center text-center p-6">
    <div className="flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 rounded-full">
      {icon}
    </div>
    <p className="text-gray-800 font-semibold">{title}</p>
  </div>
);

export default Sponsored;
