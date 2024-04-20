"use client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

type Props = {
  coachId: string;
};

const RequestCoach = ({ coachId }: Props) => {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const requestCoach = async () => {
    setLoading(true);

    await fetch("/api/coaches/", {
      method: "POST",
      body: JSON.stringify({ coachId }),
    })
      .then((res) => res.json())
      .then((data) => {
        router.refresh();
        toast.success("Success!");
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Something went wrong!");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <Button onClick={() => requestCoach()}>
      {isLoading ? (
        <Loader2 className="h-8 w-8 animate-spin" />
      ) : (
        "Request Coach"
      )}
    </Button>
  );
};

export default RequestCoach;
