import React, { useEffect, useState } from "react";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import CardGridSkeleton from "@/skeleton/CardGridSkeleton";
import { FaPaw } from "react-icons/fa";


const RecentPets = () => {
  const axiosSecure = useAxiosSecure();
  const [recentPets, setRecentPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentPets = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get(
          "/pets?adopted=false&page=0&limit=6&sort=desc"
        );
        setRecentPets(res.data);
      } catch (error) {
        console.error("Failed to fetch recent pets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPets();
  }, [axiosSecure]);

  if (loading) {
    return <CardGridSkeleton />;
  }

  return (
    <section className="max-w-full mx-auto pb-12 ">
     <div className="text-center mb-12">
  <h2 className="flex items-center justify-center gap-3 text-xl md:text-2xl lg:text-3xl font-bold text-[#34B7A7]">
    <FaPaw className="text-[#34B7A7] w-6 h-6" />
    Recent Pets
  </h2>
  <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
    Discover the latest pets available for adoption. Each pet is carefully listed with detailed information to help you find your perfect companion.
  </p>
</div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {recentPets.map((pet) => (
          <Card
            key={pet._id}
            className="rounded-2xl shadow hover:shadow-md transition duration-200"
          >
            <CardHeader>
              <img
                src={pet.petImage}
                alt={pet.petName}
                className="w-full h-72 object-cover rounded"
              />
            </CardHeader>
            <CardContent className="space-y-2">
              <CardTitle className="text-xl text-[#34B7A7]">
                {pet.petName}
              </CardTitle>
              <p className="text-gray-600 text-sm dark:text-white">
                Age: {pet.petAge}
              </p>
              <p className="text-gray-600 text-sm dark:text-white">
                Short Description: {pet.shortDescription}
              </p>
              <Link to={`/petDetails/${pet._id}`}>
                <Button className="bg-[#34B7A7] hover:bg-[#189384] text-white mt-2 w-full">
                  View Pet Details
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Link to="/petListing">
          <Button className="bg-[#34B7A7] hover:bg-[#189384] text-white px-6 py-2">
            See All Pets
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default RecentPets;
