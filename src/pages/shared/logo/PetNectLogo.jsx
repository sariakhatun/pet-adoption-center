import { PawPrint } from "lucide-react"
import { Link } from "react-router"

const PetNectLogo = () => {
  return (
   <Link to='/'>
    <div className="flex items-center gap-2">
      <PawPrint className="text-[#34B7A7] w-7 h-7 lg:w-10 lg:h-10" />
      <span className=" font-extrabold text-gray-800 text-xl lg:text-4xl ">
        <span className="text-[#34B7A7] ">Pet</span>Nect
      </span>
    </div>
   </Link>
  )
}

export default PetNectLogo
