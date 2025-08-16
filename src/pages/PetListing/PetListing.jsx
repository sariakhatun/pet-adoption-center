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
import CardGridSkeleton from "@/skeleton/CardGridSkeleton";

const PetListing = () => {
  const axiosSecure = useAxiosSecure();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteQuery({
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

  const handleSearch = (e) => setSearch(e.target.value);
  const handleCategory = (value) => {
    setCategory(value === "all" ? "" : value);
  };

  if (isLoading) {
    return (
      <div className="max-w-full mt-10 mb-32 mx-auto px-4 py-10">
        <CardGridSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto pt-6 mt-12 pb-12 px-4">
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
            <SelectItem value="others">Others</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Pet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.pages.map((page, pageIndex) =>
          page.map((pet, idx) => (
            <Card
              key={`${pageIndex}-${idx}`}
              className="rounded-2xl shadow hover:shadow-md transition duration-200"
            >
              <CardHeader>
                <img
                  src={pet.petImage}
                  alt={pet.petName}
                  className="w-full h-76 object-cover rounded"
                />
              </CardHeader>
              <CardContent className="space-y-2">
                <CardTitle className="text-xl text-[#34B7A7] ">
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
          ))
        )}
      </div>

      {/* Infinite Scroll Observer */}
      <div ref={ref} className="mt-10 mb-32">
        {isFetchingNextPage && <CardGridSkeleton />}
      </div>
    </div>
  );
};

export default PetListing;
