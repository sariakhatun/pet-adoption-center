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
import { Link } from "react-router-dom";

const PAGE_LIMIT = 6;

const DonationCampaigns = () => {
  const axiosSecure = useAxiosSecure();
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ["donationCampaigns"],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await axiosSecure.get(
        `/donation-campaigns?page=${pageParam}&limit=${PAGE_LIMIT}`
      );
      // Backend sends { total, campaigns }
      return res.data.campaigns;
    },
    getNextPageParam: (lastPage, allPages) => {
      // If last page has less than PAGE_LIMIT items, no more pages
      return lastPage.length < PAGE_LIMIT ? undefined : allPages.length;
    },
  });

  // Automatically fetch next page when last card comes into view
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 text-center text-lg">
        Loading campaigns...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 text-center text-red-600">
        Failed to load campaigns.
      </div>
    );
  }

  // Flatten pages array of arrays into one array
  const campaigns = data?.pages.flat() || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-8 text-[#34B7A7] text-center">
        Donation Campaigns
      </h2>

      {campaigns.length === 0 ? (
        <p className="text-center text-gray-600">No campaigns found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign, index) => {
            // Attach ref to last campaign card for infinite scroll trigger
            const isLastCampaign = index === campaigns.length - 1;
            return (
              <Card
                key={campaign._id}
                className="shadow-md hover:shadow-lg"
                ref={isLastCampaign ? ref : undefined}
              >
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
                    <strong>Donated:</strong> ৳{campaign.donatedAmount || 0}
                  </p>
                  <Link to={`/donation-details/${campaign._id}`}>
                    <Button variant="outline" className="w-full mt-2">
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div className="h-12 flex justify-center items-center mt-10">
        {isFetchingNextPage && <p className="text-gray-500">Loading more...</p>}
        {!hasNextPage && campaigns.length > 0 && (
          <p className="text-gray-500">No more campaigns</p>
        )}
      </div>
    </div>
  );
};

export default DonationCampaigns;
