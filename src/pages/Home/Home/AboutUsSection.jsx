import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FaInfoCircle, FaHeart, FaDonate } from "react-icons/fa"

const AboutUsSection = () => {
  return (
    <section className="my-12 py-12 max-w-full mx-auto">
      {/* Section Heading */}
      <div className="text-center mb-12">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-[#1F2937] flex items-center justify-center gap-3">
          <FaInfoCircle className="text-[#34B7A7]" />
          <span className="text-[#34B7A7]"> About PetNect</span>
        </h2>
        <p className="mt-4 text-gray-600 lg:text-lg max-w-2xl mx-auto dark:text-white">
          We connect loving people with lovable pets — making adoption simple, safe, and full of heart.
        </p>
      </div>

      {/* Card Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Support & Donations */}
        <Card className="shadow-md border border-gray-200 dark:border-gray-700">
          <CardHeader className="flex items-center gap-2">
            <FaDonate className="text-[#34B7A7] text-2xl" />
            <CardTitle className="text-2xl font-semibold text-[#1F2937] dark:text-white">Support & Donations</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 space-y-4 text-base leading-relaxed dark:text-white">
            <p>
              PetNect offers opportunities to support animals through donation campaigns. You can sponsor pets, contribute to shelter funds, or help fund veterinary care.
            </p>
            <p>
              Donations are securely processed and directly help pets in need. Your contribution can make a real difference in their lives.
            </p>
            <p>
              You can also volunteer locally, participate in community events, and help spread awareness to give animals a second chance at life.
            </p>
          </CardContent>
        </Card>

        {/* Why We Created It */}
        <Card className="shadow-md border border-gray-200 dark:border-gray-700">
          <CardHeader className="flex items-center gap-2">
            <FaHeart className="text-[#34B7A7] text-2xl" />
            <CardTitle className="text-2xl font-semibold text-[#1F2937] dark:text-white">Why We Created It</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 space-y-4 text-base leading-relaxed dark:text-white">
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
