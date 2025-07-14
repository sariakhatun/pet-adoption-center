import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-xl border-red-200">
        <CardHeader className="flex items-center gap-3">
          <AlertTriangle className="text-red-500 w-8 h-8" />
          <CardTitle className="text-red-600 text-2xl font-semibold">
            403 - Forbidden
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-gray-600">
            You do not have permission to access this page.
          </p>
          <Button
            onClick={() => navigate(-1)}
            className="bg-[#34B7A7] hover:bg-[#2fa99b] text-white w-full"
          >
            Go Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Forbidden;
