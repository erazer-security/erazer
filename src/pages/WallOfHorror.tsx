import styles from "./WallOfHorror.module.css";
import StoryCard from "@components/StoryCard";
import stories from "@pages/wallOfHorrorStories.json";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { isMobile } from "react-device-detect";

import "swiper/css";
import "swiper/css/navigation";

export default function WallOfHorror() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Hall of Horror</h1>
      <p className={styles.tagLine}>
        Hear stories from others who've had their identities stolen.
      </p>

      <Swiper
        slidesPerView={isMobile ? 1 : 3}
        spaceBetween={isMobile ? 0 : 10}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[Autoplay, Pagination]}
        className={styles.storiesCarousel}
      >
        {stories.stories.map((story, index) => (
          <SwiperSlide key={index} className={styles.storySlide}>
            <StoryCard
              title={story.title}
              author={story.author}
              story={story.story}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
