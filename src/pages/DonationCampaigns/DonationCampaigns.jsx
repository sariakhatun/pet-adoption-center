import React, { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DonationCampaigns = () => {
  const axiosSecure = useAxiosSecure();
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["donationCampaigns"],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await axiosSecure.get(
        `/donation-campaigns?page=${pageParam}&limit=6`
      );
      return res.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      // If less than 6 items, there’s no more data
      return lastPage.length < 6 ? undefined : allPages.length;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-8 text-[#34B7A7] text-center">
        Donation Campaigns
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.pages.map((page) =>
          page.map((campaign) => (
            <Card key={campaign._id} className="shadow-md hover:shadow-lg">
              <CardHeader className="p-0">
                <img
                  src={campaign.petImage}
                  alt={campaign.petName}
                  className="w-full h-48 object-cover rounded-t-md"
                />
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <CardTitle className="text-xl text-[#34B7A7]">
                  {campaign.petName}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  {campaign.shortDescription}
                </CardDescription>
                <p className="text-sm">
                  <strong>Max Donation:</strong> ৳{campaign.maxDonationAmount}
                </p>
                <p className="text-sm">
                  <strong>Donated:</strong> ৳{campaign.donatedAmount}
                </p>
                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() =>
                    window.location.href = `/donation-details/${campaign._id}`
                  }
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div ref={ref} className="h-12 flex justify-center items-center mt-10">
        {isFetchingNextPage && <p className="text-gray-500">Loading more...</p>}
        {!hasNextPage && !isLoading && (
          <p className="text-gray-500">No more campaigns</p>
        )}
      </div>
    </div>
  );
};

export default DonationCampaigns;
