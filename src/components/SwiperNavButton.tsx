import { useSwiper } from "swiper/react";
import { Button } from "@chakra-ui/react";

interface SwiperNavButtonsProps {
  onThisIsMeClick: () => void;
  onNotMeClick: () => void;
}

export const SwiperNavButtons = ({
  onThisIsMeClick,
  onNotMeClick,
}: SwiperNavButtonsProps) => {
  const swiper = useSwiper();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: "20px",
      }}
    >
      <Button
        onClick={() => {
          onNotMeClick();
          swiper.slideNext();
        }}
        style={{
          backgroundColor: "#ff6961",
          color: "white",
        }}
      >
        Not me
      </Button>
      <Button
        onClick={() => {
          onThisIsMeClick();
          swiper.slideNext();
        }}
        style={{
          backgroundColor: "#6736f5",
          color: "white",
          marginLeft: "10px",
        }}
      >
        This is me
      </Button>
    </div>
  );
};
