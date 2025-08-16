import { FaHandsHelping, FaBullhorn, FaShareAlt } from "react-icons/fa"

const HowToHelpSection = () => {
  const helps = [
    {
      id: 1,
      icon: <FaBullhorn className="text-white text-5xl transition-transform duration-300 group-hover:scale-110" />,
      title: "Join a Rescue Mission",
      text: "Be a part of local animal rescue events — assist shelters in urgent rescues and give animals a second chance.",
    },
    {
      id: 2,
      icon: <FaHandsHelping className="text-white text-5xl transition-transform duration-300 group-hover:scale-110" />,
      title: "Volunteer Your Time",
      text: "Help at events, walk dogs, clean shelters, or even foster pets in need.",
    },
    {
      id: 3,
      icon: <FaShareAlt className="text-white text-5xl transition-transform duration-300 group-hover:scale-110" />,
      title: "Spread the Word",
      text: "Share PetNect stories and help animals find their forever homes.",
    },
  ]

  return (
    <section className="my-12 py-12 max-w-full mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold  flex items-center justify-center gap-3 text-[#34B7A7]">
          <FaHandsHelping className="text-[#34B7A7] animate-pulse dark:text-white" />
          How You Can Help
        </h2>
        <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto dark:text-white ">
          Whether you lend your time, your voice, or your heart — you have the power to change a life.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {helps.map(({ id, icon, title, text }) => (
          <div
            key={id}
            className="group p-8 rounded-3xl bg-gradient-to-tr from-[#34B7A7] via-[#48C9B0] to-[#66C8B7] text-white shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="flex justify-center mb-6">{icon}</div>
            <h3 className="text-2xl font-bold mb-3">{title}</h3>
            <p className="text-base leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default HowToHelpSection
