import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaSmile, FaDog, FaCat, FaHeart, FaPaw } from "react-icons/fa";
import cta1 from "../../../assets/max.jpeg"; // Replace with real paths
import cta2 from "../../../assets/luna.jpeg";
import cta3 from "../../../assets/family.jpeg";
const SuccessStoriesSection = () => {
  const stories = [
    {
      id: 1,
      icon: <FaDog className="text-[#34B7A7] text-3xl" />,
      title: "Max's Journey",
      text: "Rescued from the streets, Max found love and comfort in his forever home. Now, every tail wag is a thank you.",
      image: cta1,
    },
    {
      id: 2,
      icon: <FaCat className="text-[#34B7A7] text-3xl" />,
      title: "Luna's New Life",
      text: "Once shy, Luna now purrs proudly in a cozy new home filled with toys and treats.",
      image: cta2,
    },
    {
      id: 3,
      icon: <FaHeart className="text-[#34B7A7] text-3xl" />,
      title: "A Family Complete",
      text: "Rocky brought healing and happiness to a family in need. Sometimes, rescue goes both ways.",
      image: cta3,
    },
  ];

  return (
    <section className="my-12 max-w-full mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-[#1F2937] flex items-center justify-center gap-3">
          <FaPaw className="text-[#34B7A7] lg:text-3xl drop-shadow-sm animate-bounce" />
          <span className="bg-gradient-to-r from-[#34B7A7] to-[#1F93B7] bg-clip-text text-transparent">
            Success Stories
          </span>
        </h2>
        <p className="mt-2 text-gray-600 text-lg max-w-2xl mx-auto dark:text-white">
          These heartwarming stories celebrate the beautiful bonds formed
          through adoption. From scared strays to beloved family members, see
          how PetNect has helped transform lives — one paw at a time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stories.map(({ id, title, text, image, icon }) => (
          <Card
            key={id}
            className="shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden rounded-xl"
          >
            <div className="relative group">
              <img
                src={image}
                alt={title}
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-0 bg-gradient-to-t from-black/60 to-transparent text-white w-full px-4 py-2">
                <h3 className="text-lg font-semibold dark:text-white">{title}</h3>
              </div>
            </div>
            <CardHeader className="flex items-center gap-3 mt-2">
              {icon}
              <CardTitle className="text-xl text-[#1F2937] dark:text-white">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm leading-relaxed dark:text-white">{text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default SuccessStoriesSection;
