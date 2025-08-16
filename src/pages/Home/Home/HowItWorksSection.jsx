import React from "react";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { FaSearch, FaPaw, FaHome, FaHeart, FaCogs } from "react-icons/fa";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: <FaSearch className="w-8 h-8 text-[#34B7A7]" />,
      title: "Browse Pets",
      description:
        "Explore our collection of adorable pets available for adoption.",
    },
    {
      icon: <FaPaw className="w-8 h-8 text-[#34B7A7]" />,
      title: "Select Your Favorite",
      description:
        "Choose the pet you’d like to adopt or support through donations.",
    },
    {
      icon: <FaHome className="w-8 h-8 text-[#34B7A7]" />,
      title: "Adopt or Donate",
      description:
        "Complete the adoption process or contribute to our donation campaigns.",
    },
    {
      icon: <FaHeart className="w-8 h-8 text-[#34B7A7]" />,
      title: "Give Love & Care",
      description:
        "Bring joy to your new pet and make a positive impact on their life.",
    },
  ];

  return (
    <section className="py-12 max-w-full mx-auto">
      <div className="max-w-full mx-auto text-center mb-12">
        <h2 className="text-xl md:text-2xl lg:text-3xl  font-bold text-[#34B7A7] flex items-center justify-center gap-2">
          <FaCogs className="w-8 h-8" /> How It Works
        </h2>
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          Adopting a pet or supporting a donation campaign is simple and
          straightforward. Follow these steps:
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-full mx-auto">
        {steps.map((step, idx) => (
          <Card
            key={idx}
            className="p-6 text-center shadow-lg hover:shadow-xl transition duration-300"
          >
            <div className="flex justify-center mb-4">{step.icon}</div>
            <CardTitle className="text-xl font-semibold text-[#34B7A7]">
              {step.title}
            </CardTitle>
            <CardDescription className="mt-2 text-gray-600 dark:text-gray-300">
              {step.description}
            </CardDescription>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default HowItWorksSection;
