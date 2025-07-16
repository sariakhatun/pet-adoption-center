import React from "react";
import { useRouteError, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const ErrorPage = () => {
  const error = useRouteError();
  console.error("Routing Error:", error);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 dark:bg-gray-900 text-center px-4">
      <div className="max-w-md">
        <div className="flex justify-center mb-6">
          <AlertTriangle className="h-16 w-16 text-red-500 dark:text-red-400" />
        </div>

        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
          Oops! Something went wrong.
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {error?.statusText || error?.message || "An unexpected error occurred."}
        </p>

        {error?.status && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Error Code: {error.status}
          </p>
        )}

        <Button asChild className="bg-[#34B7A7] hover:bg-[#2fa99b] text-white">
          <Link to="/">← Back to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
