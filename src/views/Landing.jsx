import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import Slider from "react-slick";
import { LandingPoint } from "../components/LandingPoint";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../utils/landing-parallax.css";
import listat from "../img/landing-kuvat/listat.png";
import { useNavigate } from "react-router-dom";
import { ListElement } from "../components/ListElement";

export const Landing = () => {
  const navigate = useNavigate();

  const images = [listat]; // Replace with your image URLs

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (index) => {
    setSelectedImage(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const parallaxContainer = document.getElementById("parallax-container");
    const layers = document.querySelectorAll(".parallax-layer");

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      layers.forEach((layer, index) => {
        const strength = (index + 1) * 0.05;
        const xOffset = (clientX - centerX) * strength;
        const yOffset = (clientY - centerY) * strength;

        layer.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
      });
    };

    parallaxContainer.addEventListener("mousemove", handleMouseMove);

    return () => {
      parallaxContainer.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  const style = {
    /*
    container:
      "flex flex-col items-center max-w-[500px] w-full h-full m-auto p-2 font-quicksand",
*/
    /*
    header: "bg-jade text-lg text-white pt-4 pb-8 text-center",
    */
    headerText: "font-bold mb-2 flex justify-center items-center",
    h2: "text-white text-2xl font-bold mb-2",
    h3: "text-white mb-2",
    /*
    slogan: "text-center text-white text-2xl md:text-3xl mt-4 font-bold",
    */
    container:
      "flex flex-col items-center max-w-[500px] w-full h-full m-auto p-2 font-quicksand",
    header:
      "bg-jade text-lg md:text-xl lg:text-2xl text-white pt-4 pb-8 text-center",
    slogan: "text-center text-white text-2xl md:text-3xl mt-4 font-bold",
    starter:
      "text-center text-white py-2 px-4 mt-4 rounded-full  transition duration-300 hover:bg-pink-700",
    startButton:
      "bg-pink text-white py-2 mt-4 px-4 rounded-full font-bold transition duration-300 hover:bg-pink-700",
    learnMore:
      "md:hidden text-center text-white mx-auto p-4 gap-4 flex flex-col w-fit rounded-full transition duration-300 hover:bg-pink-700",
    introduction:
      "text-lg shadow-md text-black text-center bg-dogwood tracking-wide rounded-md p-8 mx-auto",
    introH3: "text-black mb-2",
    introHeader: "mb-8",
    link: "text-pink bg-dogwood font-bold",
    icon: "transition ease-in-out delay-70 hover:scale-130 duration-70",
    feature: "text-center py-4 md:py-16",
    featureContainer: "mx-auto",
    footer: "text-center w-full py-8 px-2 bg-darkblue text-white",
    pointsContainer: "mt-8",
    plusButton: "border p-4 bg-pink text-black",
    carousel: "slick-carousel w-96 mx-auto shadow-md",
    carouselImage: "cursor-pointer w-full",
  };

  const customArrowStyle = {
    customArrow: {
      background: "pink",
      color: "white",
      padding: "10px",
      marginTop: "8px",
      borderRadius: "50%",
      fontWeight: "bold",
    },
  };

  const CustomPrevArrow = (props) => (
    <button
      {...props}
      className={`slick-arrow slick-prev custom-arrow ${style.startButton}`}
    >
      ⬅️
    </button>
  );

  const CustomNextArrow = (props) => (
    <button
      {...props}
      style={customArrowStyle}
      className={`slick-arrow slick-next custom-arrow ${style.startButton}`}
    >
      ➡️
    </button>
  );

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };

  return (
    <div className={style.container}>
      <main className=" flex flex-col min-h-screen flex-grow justify-between">
        <div>
          <header class={style.header}>
            <h1 class={style.headerText}>
              <span className={style.icon}>🍉</span> PuuhaPlanneri
            </h1>
            <p className={style.slogan}>
              Suunnittele huippuhetket ja tehokas tekeminen – kaikki yhdessä
              paketissa!
            </p>
          </header>

          <div id="parallax-container" className={`${style.introduction}`}>
            <div class="parallax-layer" id="layer1">
              📝
            </div>
            <div class="parallax-layer" id="layer2">
              📌
            </div>
            <div className={style.introHeader}>
              <h3 className={style.introH3}>
                PuuhaPlanneri on <span className="font-bold">älykäs</span> ja{" "}
                <span className="font-bold">helppokäyttöinen </span>
                tehtävälistasovellus, joka tekee arjen järjestämisestä leikkiä.
              </h3>
            </div>
            <div></div>

            <p>
              Käyttäjäystävällinen käyttöliittymä, tehokkaat
              ajanhallintatyökalut ja mahdollisuus nauttia jokaisesta hetkestä
              suunnitelmien toteuttamisen lomassa tekevät PuuhaPlannerista
              ihanteellisen kumppanin tavoitteidesi saavuttamiseen hymyssä suin.
            </p>
          </div>
          <div className={style.starter}>
            <p>Järjestele ja ole tuottoisa PuuhaPlannerin avulla</p>
            <div className="flex flex-col w-fit justify-center mx-auto gap-4">
              <button onClick={() => navigate("/")} class={style.startButton}>
                Aloita
              </button>
            </div>
          </div>
        </div>
        <div className={style.learnMore}>
          <a href="#feature" className={`${style.link} mt-8 mb-2`}>
            lisätietoa
          </a>
          <div class="w-6 self-center transition duration-500 ease-in-out transform hover:-translate-y-1">
            <a href="#feature" className={style.link} id="down-button">
              <svg
                class="w-6 h-6  animate-bounce"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </a>
          </div>
        </div>
      </main>

      <div id="feature" class={style.feature}>
        <h2 class="text-3xl text-white font-bold my-5">Ominaisuudet</h2>
        <div class={style.featureContainer}></div>
        <div className={style.pointsContainer}>
          <div className="w-full mx-auto">
            <h2 className="text-2xl text-black text-start font-bold">Listat</h2>
            <ListElement icon={"🍉"} name={"ostoslista"}></ListElement>
            <ListElement icon={"✏"} name={"opiskelu"}></ListElement>
            <ListElement icon={"🍉"} name={"moi"}></ListElement>
            <LandingPoint
              header={"Luo useita listoja"}
              text={
                "Luo useita listoja, jotta voit järjestää tehtäväsi eri kategorioihin."
              }
            />
          </div>

          <LandingPoint
            header={"Järjestele tehtäväsi"}
            text={
              "Luo ja hallitse tehtäväsi helposti pysyäksesi ajan tasalla tehtäväluettelostasi."
            }
          />
          <LandingPoint
            header={"Kutsu muut listaasi"}
            text={
              "Kutsu ystäväsi ja perheesi listaasi, jotta voitte suunnitella yhdessä."
            }
          />
        </div>
      </div>

      <footer class={style.footer}>
        <p>&copy; 2023 PuuhaPlanneri</p>
        <p className="text-sm">
          Tämän sivun suunnittelussa hyödynnetty{" "}
          <a className="text-blue" href="https://webweave.fi">
            Webweavea
          </a>
        </p>
      </footer>
    </div>
  );
};
