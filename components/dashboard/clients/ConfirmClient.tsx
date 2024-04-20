"use client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

type Props = {
  id: string;
};

const ConfirmClient = ({ id }: Props) => {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const requestCoach = async () => {
    setLoading(true);

    await fetch("/api/clients/", {
      method: "POST",
      body: JSON.stringify({ id }),
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
        "Confirm Request"
      )}
    </Button>
  );
};

export default ConfirmClient;
