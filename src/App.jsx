import { Button } from "@/components/ui/button"
import { CarouselDemo } from "./components/Demo/CarouselDemo"
import { CardDemo } from "./components/Demo/CardDemo"


function App() {
  return (
   <div className="min-h-screen items-center justify-center flex flex-col">
     <Button>Hello </Button>
    <CarouselDemo></CarouselDemo>
    <CardDemo></CardDemo>
    
   </div>
  )
}

export default App