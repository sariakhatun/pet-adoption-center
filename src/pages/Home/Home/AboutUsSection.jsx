import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FaInfoCircle, FaHeart, FaPaw } from "react-icons/fa"

const AboutUsSection = () => {
  return (
    <section className="my-20 px-4 sm:px-6 lg:px-12 max-w-6xl mx-auto">
      {/* Section Heading */}
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1F2937] flex items-center justify-center gap-3">
          <FaInfoCircle className="text-[#34B7A7]" />
          About <span className="text-[#34B7A7]">PetNect</span>
        </h2>
        <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
          We connect loving people with lovable pets — making adoption simple, safe, and full of heart.
        </p>
      </div>

      {/* Card Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* How It Works */}
        <Card className="shadow-md border border-gray-200">
          <CardHeader className="flex items-center gap-2">
            <FaPaw className="text-[#34B7A7] text-2xl" />
            <CardTitle className="text-2xl font-semibold text-[#1F2937]">How It Works</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 space-y-4 text-base leading-relaxed">
            <p>
              PetNect is your gateway to finding a forever friend. We collaborate with trusted shelters and
              animal rescue centers to bring verified listings of pets in need of homes.
            </p>
            <p>
              Users can explore adoptable pets, learn about their backgrounds, and connect with shelters directly through the platform.
              From browsing to adoption — everything happens in a few safe and simple steps.
            </p>
            <p>
              You can also support animals through donation campaigns, sponsor pets, or join local volunteer efforts.
            </p>
          </CardContent>
        </Card>

        {/* Why We Created It */}
        <Card className="shadow-md border border-gray-200">
          <CardHeader className="flex items-center gap-2">
            <FaHeart className="text-[#34B7A7] text-2xl" />
            <CardTitle className="text-2xl font-semibold text-[#1F2937]">Why We Created It</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 space-y-4 text-base leading-relaxed">
            <p>
              Every year, millions of pets end up in shelters — many never find homes. We built PetNect to change that. This isn’t just a website; it’s a mission.
            </p>
            <p>
              Our goal is to give every animal the second chance they deserve. Through technology and compassion,
              we want to make pet adoption not only easier but emotionally rewarding for everyone involved.
            </p>
            <p>
              Whether you’re adopting, donating, or spreading the word — you’re helping write a better story for countless animals.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default AboutUsSection
