import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import cta1 from "../../../assets/pic.jpeg"; // Replace with real paths
import cta2 from "../../../assets/pic2.jpeg";
import cta3 from "../../../assets/pic3.jpeg";
import { FaPaw } from "react-icons/fa";

const CallToActionSection = () => {
  const cards = [
    {
      id: 1,
      title: "Adopt Love",
      text: "Give a stray pet the warmth of a home and the love of a family. Adoption changes lives—yours and theirs.",
      image: cta1,
    },
    {
      id: 2,
      title: "Forever Homes",
      text: "Every pet deserves a forever home. Make a difference by opening your heart to one of our furry friends.",
      image: cta2,
    },
    {
      id: 3,
      title: "Be a Hero",
      text: "You don’t need a cape to be a hero. Adopting a pet saves lives and brings unmatched joy to your home.",
      image: cta3,
    },
  ];

  return (
    <section className="my-20 px-4 sm:px-6 lg:px-12">
      {/* Section Heading */}
      <div className="text-center mb-12 max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1F2937] leading-snug flex items-center justify-center gap-2">
          <FaPaw className="text-[#34B7A7] text-4xl" />
          <span>
            <span className="text-[#34B7A7]">Call to Action</span> Section
          </span>
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Inspire change. Give pets the life they deserve by opening your heart
          and home.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map(({ id, title, text, image }) => (
          <Card key={id} className="overflow-hidden shadow-md">
            <img src={image} alt={title} className="w-full h-56 object-cover" />
            <CardHeader>
              <CardTitle className="text-xl text-[#1F2937]">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm leading-relaxed">{text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default CallToActionSection;
