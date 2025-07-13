import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FaDog, FaCat, FaFeatherAlt, FaCrow, FaPaw } from 'react-icons/fa';

const categoryOptions = [
  { value: 'dog', label: 'Dog', icon: <FaDog className="text-3xl text-[#34B7A7]" /> },
  { value: 'cat', label: 'Cat', icon: <FaCat className="text-3xl text-[#34B7A7]" /> },
  { value: 'rabbit', label: 'Rabbit', icon: <FaFeatherAlt className="text-3xl text-[#34B7A7]" /> },
  { value: 'bird', label: 'Bird', icon: <FaCrow className="text-3xl text-[#34B7A7]" /> },
  { value: 'others', label: 'Others', icon: <FaPaw className="text-3xl text-[#34B7A7]" /> },
];

const PetsCategory = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/pets/category/${category}`);
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-[#34B7A7]">Browse by Pet Category</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {categoryOptions.map((option) => (
          <Card
            key={option.value}
            className="p-6 text-center hover:shadow-lg transition cursor-pointer"
            onClick={() => handleCategoryClick(option.value)}
          >
            <div className="flex justify-center mb-3">{option.icon}</div>
            <h4 className="text-lg font-semibold text-[#34B7A7]">{option.label}</h4>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PetsCategory;
