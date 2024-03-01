"use client";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function Experimental() {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [result, setResult] = useState<string>("");

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      toast({
        variant: "destructive",
        description: "Please select a proper image",
      });
      return;
    }

    setSelectedImage(event.target.files[0]);
  };

  const handleImageUpload = async () => {
    try {
      setResult("Please wait a few seconds...");

      var myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        `Bearer ${process.env.NEXT_PUBLIC_AIORNOT_API_KEY}`
      );
      myHeaders.append("Accept", "application/json");

      var formdata = new FormData();
      formdata.append("object", selectedImage as Blob);

      fetch("https://api.aiornot.com/v1/reports/image", {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow",
      })
        .then((response) => response.json())
        .then((result) => {
          setResult(
            `Your image seems to be ${result.report.verdict} generated`
          );
        })
        .catch((error) => {
          console.error("error", error);
          toast({
            variant: "destructive",
            description:
              "There was an error processing your image. Please try again.",
          });
        });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        variant: "destructive",
        description:
          "There was an error processing your image. Please try again.",
      });
    }
  };

  return (
    <div className="flex flex-col gap-5 py-10 lg:px-44">
      <h1 className="text-center text-[50px] font-medium leading-[55px] tracking-[-2.5px]">
        AI Image Detector
      </h1>
      <h4 className="text-[#A7A7A7] text-center text-[26px] font-medium leading-[28.6px] tracking-[-1.3px]">
        Quickly determine if an image is AI or not
      </h4>
      <div className="flex flex-col justify-center items-center gap-10 mt-16">
        <h4 className="text-center text-[26px] font-medium leading-[28.6px] tracking-[-1.3px]">
          {result}
        </h4>
        <div className="flex flex-col md:flex-row gap-5 md:gap-0 justify-center items-center">
          <input
            type="file"
            name="image"
            accept="image/apng, image/gif, image/jpeg, image/png, image/svg+xml, image/webp"
            onChange={handleImageChange}
          />
          <button
            onClick={handleImageUpload}
            className="w-fit text-base px-8 py-4 justify-center items-center gap-6 rounded-full backdrop-blur-xl bg-gradient-to-br from-[#7E30E1] to-[#49108B] hover:from-[#3F0687] hover:to-[#36096A] active:from-[#100320] active:to-[#310267] transition-colors duration-100 ease-in-out"
          >
            Upload Image
          </button>
        </div>
      </div>
    </div>
  );
}
