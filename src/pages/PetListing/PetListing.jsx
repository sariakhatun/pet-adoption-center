import React, { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { Link } from "react-router-dom";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PetListing = () => {
  const axiosSecure = useAxiosSecure();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isLoading, refetch } =
    useInfiniteQuery({
      queryKey: ["pets", search, category],
      queryFn: async ({ pageParam = 0 }) => {
        const res = await axiosSecure.get(
          `/pets?adopted=false&page=${pageParam}&limit=6&search=${search}&category=${category}`
        );
        return res.data;
      },
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage || lastPage.length < 6) return undefined;
        return allPages.length;
      },
    });

  // Trigger next page fetch when observer is in view
  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage, fetchNextPage]);

  // Manual filter/search trigger
  const handleSearch = (e) => setSearch(e.target.value);
  const handleCategory = (value) => {
    setCategory(value === "all" ? "" : value);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6 text-[#34B7A7]">
        Available Pets for Adoption
      </h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Input
          type="text"
          placeholder="Search by name..."
          className="w-full sm:w-72"
          value={search}
          onChange={handleSearch}
        />

        <Select onValueChange={handleCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="dog">Dog</SelectItem>
            <SelectItem value="cat">Cat</SelectItem>
            <SelectItem value="bird">Bird</SelectItem>
            <SelectItem value="rabbit">Rabbit</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Pet Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.pages.map((page, pageIndex) =>
          page.map((pet, idx) => (
            <Card
              key={`${pageIndex}-${idx}`}
              className="rounded-lg shadow hover:shadow-md transition duration-200"
            >
              <CardHeader>
                <img
                  src={pet.petImage}
                  alt={pet.petName}
                  className="w-full h-96 object-cover rounded"
                />
              </CardHeader>
              <CardContent className="space-y-2">
                <CardTitle className="text-xl text-[#34B7A7]">
                  {pet.petName}
                </CardTitle>
                <p className="text-gray-600 text-sm">Age: {pet.petAge}</p>
                <p className="text-gray-600 text-sm">
                  Location: {pet.petLocation}
                </p>
                <Link to={`/petDetails/${pet._id}`}>
                  <Button className="bg-[#34B7A7] mt-2 w-full">
                    View Pet Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Infinite Scroll Observer */}
      <div ref={ref} className="h-10 mt-10">
        {isLoading && <p className="text-center text-gray-500">Loading...</p>}
      </div>
    </div>
  );
};

export default PetListing;
