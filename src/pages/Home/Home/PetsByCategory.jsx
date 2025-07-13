import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PetsByCategory = () => {
  const { category } = useParams();
  const axiosSecure = useAxiosSecure();

  const {
    data: pets = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["petsByCategory", category],
    queryFn: async () => {
      const res = await axiosSecure.get(`/pets?category=${category}`);
      return res.data;
    },
  });

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (isError || pets.length === 0)
    return (
      <p className="text-center mt-10 text-red-500 font-medium">
        No pets found in <strong>{category}</strong> category.
      </p>
    );

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-[#34B7A7] capitalize">
        {category}s Available for Adoption 
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {pets.map((pet) => (
          <Card key={pet._id} className="overflow-hidden">
            <CardHeader className="p-0">
              <img
                src={pet.petImage}
                alt={pet.petName}
                className="w-full h-48 object-cover"
              />
            </CardHeader>

            <CardContent className="px-4 py-2">
              <CardTitle className="text-[#34B7A7] text-lg">
                {pet.petName}
              </CardTitle>
              <p className="text-sm text-gray-600">{pet.shortDescription}</p>
              <p className="text-sm">
                <strong>Age:</strong> {pet.petAge}
              </p>
              <p className="text-sm">
                <strong>Location:</strong> {pet.petLocation}
              </p>
            </CardContent>

            <CardFooter className="px-4 pb-4">
              <Link to={`/petDetails/${pet._id}`}>
              <Button
                className="w-full bg-[#34B7A7] text-white hover:bg-[#2fa99b]"
                
              >
                View Details
              </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PetsByCategory;
