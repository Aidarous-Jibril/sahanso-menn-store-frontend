import React, { useState } from "react";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import dynamic from "next/dynamic";
import Head from "next/head";
const Slider = dynamic(() => import("react-slick"), { ssr: false });

const images = [
  { src: "/images/bannerImgOne.jpg", alt: "Banner Image One" },
  { src: "/images/bannerImgThree.jpg", alt: "Banner Image Three" },
  { src: "/images/bannerImgFour.jpg", alt: "Banner Image Four" },
];

const HeroPage = () => {
  const [dotActive, setDotActive] = useState(0);

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (_, next) => setDotActive(next),
    appendDots: (dots) => (
      <div
        style={{
          position: "absolute",
          top: "70%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "210px",
        }}
      >
        <ul className="flex justify-between items-center p-0 m-0">{dots}</ul>
      </div>
    ),
    customPaging: (i) => (
      <div
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: i === dotActive ? "#131921" : "#232F3E",
          color: "white",
          cursor: "pointer",
          border: `1px solid ${i === dotActive ? "#f3a847" : "white"}`,
        }}
      >
        {i + 1}
      </div>
    ),
  };

  return (
    <section
      className=" hero relative w-full overflow-hidden h-[260px] sm:h-[300px] md:h-[340px] lg:h-[360px] xl:h-[340px] 2xl:h-[420px]"
    >
      <div className="w-full h-full relative">
        <Head>
          <link rel="preload" as="image" href="/images/bannerImgOne.jpg" />
        </Head>

        <Slider {...settings}>
          {images.map((image, index) => (
            <div key={index}>
              <Image
                src={image.src}
                alt={image.alt}
                layout="responsive"
                width={1920}
                height={880}
                priority={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default HeroPage;
