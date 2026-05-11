import style from "@/css/Home.module.css";
import React from "react";
import { CircularGallery, GalleryItem } from "@/components/ui/circular-gallery";

const galleryData: GalleryItem[] = [
  {
    common: "Lion",
    binomial: "Panthera leo",
    photo: {
      url: "https://images.unsplash.com/photo-1583499871880-de841d1ace2a?w=900&auto=format&fit=crop&q=80",
      text: "lion couple kissing on a brown rock",
      pos: "47% 35%",
      by: "Clément Roy",
    },
  },
  {
    common: "Asiatic elephant",
    binomial: "Elephas maximus",
    photo: {
      url: "https://images.unsplash.com/photo-1571406761758-9a3eed5338ef?w=900&auto=format&fit=crop&q=80",
      text: "herd of Sri Lankan elephants walking away from a river",
      pos: "75% 65%",
      by: "Alex Azabache",
    },
  },
  {
    common: "Red-tailed black cockatoo",
    binomial: "Calyptorhynchus banksii",
    photo: {
      url: "https://images.unsplash.com/photo-1619664208054-41eefeab29e9?w=900&auto=format&fit=crop&q=80",
      text: "close-up of a black cockatoo",
      pos: "53% 43%",
      by: "David Clode",
    },
  },
  {
    common: "Dromedary",
    binomial: "Camelus dromedarius",
    photo: {
      url: "https://images.unsplash.com/photo-1662841238473-f4b137e123cb?w=900&auto=format&fit=crop&q=80",
      text: "camel and her new born calf walking in the Sahara desert",
      pos: "65% 65%",
      by: "Moaz Tobok",
    },
  },
  {
    common: "Polar bear",
    binomial: "Ursus maritimus",
    photo: {
      url: "https://images.unsplash.com/photo-1589648751789-c8ecb7a88bd5?w=900&auto=format&fit=crop&q=80",
      text: "polar bear on the snow, by the water, raised on the hind legs, front paws together",
      pos: "50% 25%",
      by: "Hans-Jurgen Mager",
    },
  },
  {
    common: "Giant panda",
    binomial: "Ailuropoda melanoleuca",
    photo: {
      url: "https://images.unsplash.com/photo-1659540181281-1d89d6112832?w=900&auto=format&fit=crop&q=80",
      text: "giant panda hanging from a tree branch",
      pos: "47%",
      by: "Jiachen Lin",
    },
  },
  {
    common: "Grévy's zebra",
    binomial: "Equus grevyi",
    photo: {
      url: "https://images.unsplash.com/photo-1526095179574-86e545346ae6?w=900&auto=format&fit=crop&q=80",
      text: "zebra standing on wheat field, looking back towards the camera",
      pos: "65% 35%",
      by: "Jeff Griffith",
    },
  },
  {
    common: "Cheetah",
    binomial: "Acinonyx jubatus",
    photo: {
      url: "https://images.unsplash.com/photo-1541707519942-08fd2f6480ba?w=900&auto=format&fit=crop&q=80",
      text: "cheetah sitting in the grass under a blue sky",
      by: "Mike Bird",
    },
  },
  {
    common: "King penguin",
    binomial: "Aptenodytes patagonicus",
    photo: {
      url: "https://images.unsplash.com/photo-1595792419466-23cec2476fa6?w=900&auto=format&fit=crop&q=80",
      text: "king penguin with a fluffy brown chick on grey rocks",
      pos: "35%",
      by: "Martin Wettstein",
    },
  },
  {
    common: "Red panda",
    binomial: "Ailurus fulgens",
    photo: {
      url: "https://images.unsplash.com/photo-1689799513565-44d2bc09d75b?w=900&auto=format&fit=crop&q=80",
      text: "a red panda in a tree",
      by: "Niels Baars",
    },
  },
  {
    common: "Grévy's zebra2",
    binomial: "Equus grevyi",
    photo: {
      url: "https://images.unsplash.com/photo-1526095179574-86e545346ae6?w=900&auto=format&fit=crop&q=80",
      text: "zebra standing on wheat field, looking back towards the camera",
      pos: "65% 35%",
      by: "Jeff Griffith",
    },
  },
  {
    common: "Cheetah2",
    binomial: "Acinonyx jubatus",
    photo: {
      url: "https://images.unsplash.com/photo-1541707519942-08fd2f6480ba?w=900&auto=format&fit=crop&q=80",
      text: "cheetah sitting in the grass under a blue sky",
      by: "Mike Bird",
    },
  },
  {
    common: "King penguin2",
    binomial: "Aptenodytes patagonicus",
    photo: {
      url: "https://images.unsplash.com/photo-1595792419466-23cec2476fa6?w=900&auto=format&fit=crop&q=80",
      text: "king penguin with a fluffy brown chick on grey rocks",
      pos: "35%",
      by: "Martin Wettstein",
    },
  },
  {
    common: "Red panda2",
    binomial: "Ailurus fulgens",
    photo: {
      url: "https://images.unsplash.com/photo-1689799513565-44d2bc09d75b?w=900&auto=format&fit=crop&q=80",
      text: "a red panda in a tree",
      by: "Niels Baars",
    },
  },
];
export default function Home() {
  return (
    <section className={style.outerContainer}>
      <div className={style.container}>
        <div className={style.title}>
          <h1>
            <span>Reimagining</span> <span>Investing</span>
          </h1>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="11"
            height="19"
            viewBox="0 0 11 19"
            fill="none"
          >
            <path
              d="M1.5 1.5L9.5 9.5L1.5 17.5"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className={style.desc}>
          Traditional investing measures profit; we measures impact through
          <span> Sphere of Influence (SOI)</span>, where capital shapes societal
          outcomes.
        </p>
        <button className={style.button}>ABOUT US</button>
      </div>

      <div className={style.galleryWrap}>
        <CircularGallery items={galleryData} />
      </div>
    </section>
  );
}
