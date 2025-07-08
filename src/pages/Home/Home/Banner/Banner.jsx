import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import banner from '../../../../assets/banner (2).png'
const Banner = () => {
  return (
    <section className="my-12 relative w-full lg:h-[85vh] flex items-center justify-center bg-gray-100 overflow-hidden rounded-2xl shadow-md">
  <img
    src={banner} 
    alt="Pet Adoption Banner"
    className="inset-0 w-full h-full object-contain lg:object-cover z-0 rounded-2xl"
  />
</section>


     

  
  )
}

export default Banner
