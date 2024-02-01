import React, { useEffect, useState } from "react";

import { LandingPoint } from "../components/LandingPoint";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../utils/landing-parallax.css";
import "../utils/landing-animation.css";
import { useNavigate } from "react-router-dom";
import { ListElement } from "../components/ListElement";
import PreviewTodo from "../components/PreviewTodo";
import { InviteToListModalPreview } from "../components/InviteToListModalPreview";
import { useSpring, animated, config } from "react-spring";
import { useInView } from "react-intersection-observer";
import { landingStyle } from "../styles/landingStyle";
import { BannerDesktop } from "../components/LandingDesktop/BannerDesktop";
import { FeatureDesktop } from "../components/LandingDesktop/FeatureDesktop";

export const Landing = () => {
  const navigate = useNavigate();

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.85,
  });

  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (inView) {
      setIsAnimating(true);
    }
  }, [inView]);

  const animationProps = useSpring({
    from: {
      opacity: 0,
      transform: "translateX(-150%)",
    },
    to: async (next) => {
      await next({ opacity: 1, transform: "translateX(0%)" });
      if (!isAnimating) {
        // Reset the animation when not animating
        await next({
          opacity: 0,
          transform: "translateX(-150%)",
        });
      }
    },
    config: config.wobbly,
    reset: true, // Reset the animation when the component is unmounted
  });

  const scrollToFeature = () => {
    const featureSection = document.getElementById("feature");

    if (featureSection) {
      featureSection.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  const [isAnimatingDesktop, setIsAnimatingDesktop] = useState(false);

  const [refDesktop, inViewDesktop] = useInView({
    triggerOnce: true,
    threshold: 1,
  });

  useEffect(() => {
    if (inViewDesktop) {
      setIsAnimatingDesktop(true);
    }
  }, [inViewDesktop]);

  const animationPropsDesktop = useSpring({
    from: {
      opacity: 0,
      transform: "translateY(150%)",
    },
    to: async (next) => {
      await next({ opacity: 1, transform: "translateY(0%)" });
      if (!isAnimatingDesktop) {
        // Reset the animation when not animating
        await next({
          opacity: 0,
          transform: "translateY(150%)",
        });
      }
    },
    config: config.wobbly,
    reset: true, // Reset the animation when the component is unmounted
  });

  return (
    <>
      {" "}
      <div className={landingStyle.container}>
        <main className="flex flex-col lg:min-h-full min-h-screen flex-grow justify-between">
          <div>
            <header class={landingStyle.header}>
              <h1 class={landingStyle.headerText}>
                <span className={landingStyle.icon}>🍉</span> PuuhaPlanneri
              </h1>
              <p className={`${landingStyle.slogan} md:hidden`}>
                Suunnittele huippuhetket ja tehokas tekeminen – kaikki yhdessä
                paketissa!
              </p>
            </header>

            <BannerDesktop navigate={navigate}></BannerDesktop>

            <div
              id="parallax-container"
              className={`${landingStyle.introduction} md:hidden`}
            >
              <div class="parallax-layer" id="layer1">
                📝
              </div>
              <div class="parallax-layer" id="layer2">
                📌
              </div>
              <div className={landingStyle.introHeader}>
                <h3 className={landingStyle.introH3}>
                  PuuhaPlanneri on <span className="font-bold">älykäs</span> ja{" "}
                  <span className="font-bold">helppokäyttöinen </span>
                  tehtävälistasovellus, joka tekee arjen järjestämisestä
                  leikkiä.
                </h3>
              </div>
              <div></div>

              <p>
                Käyttäjäystävällinen käyttöliittymä, tehokkaat
                ajanhallintatyökalut ja mahdollisuus nauttia jokaisesta hetkestä
                suunnitelmien toteuttamisen lomassa tekevät PuuhaPlannerista
                ihanteellisen kumppanin tavoitteidesi saavuttamiseen hymyssä
                suin.
              </p>
            </div>
            <div className={`${landingStyle.starter} md:hidden`}>
              <p>Järjestele ja ole tuottoisa PuuhaPlannerin avulla</p>
              <div className="flex flex-col w-fit justify-center mx-auto gap-4">
                <button
                  onClick={() => {
                    navigate("/");
                    localStorage.setItem("firstVisit", "false");
                  }}
                  class={landingStyle.startButton}
                >
                  Aloita
                </button>
              </div>
            </div>
          </div>
          <div className={landingStyle.learnMore}>
            <button
              onClick={scrollToFeature}
              className={`${landingStyle.link} mt-8 mb-2`}
            >
              lisätietoa
            </button>
            <div class="w-6 self-center transition duration-500 ease-in-out transform hover:-translate-y-1">
              <button onClick={scrollToFeature} id="down-button">
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
              </button>
            </div>
          </div>
        </main>

        <FeatureDesktop
          refDesktop={refDesktop}
          animationPropsDesktop={animationPropsDesktop}
          animated={animated}
          navigate={navigate}
        ></FeatureDesktop>

        <div id="feature" class={`${landingStyle.feature} md:hidden`}>
          <h2 class="text-3xl text-white font-bold my-5">Ominaisuudet</h2>
          <div class={landingStyle.featureContainer}></div>
          <div className={landingStyle.pointsContainer}>
            <div className="w-full bg-white rounded-md mx-auto mb-8">
              <div className="p-4 ">
                <h2
                  className={`flex text-2xl font-bold mb-2 text-left text-black`}
                >
                  Listat
                </h2>
                <ListElement icon={"🍉"} name={"ostoslista"}></ListElement>
                <ListElement icon={"📝"} name={"opiskelu"}></ListElement>
                <ListElement
                  icon={"📚"}
                  name={"luettavat kirjat"}
                ></ListElement>
                <ListElement icon={"🗓️"} name={"päivän tehtävät"}></ListElement>
              </div>
              <LandingPoint
                header={"Luo useita listoja"}
                text={
                  "Luo useita listoja, jotta voit järjestää tehtäväsi eri kategorioihin."
                }
              />
            </div>
            <div className="w-full bg-white rounded-md mx-auto mb-8">
              <div className="p-4">
                <h2
                  className={`flex text-2xl font-bold mb-2 text-left text-black`}
                >
                  <span className={landingStyle.icon}>🍉</span>ostoslista
                </h2>
                <PreviewTodo text={"kaurajuoma"} complete={true}></PreviewTodo>
                <PreviewTodo text={"kurkku"} complete={true}></PreviewTodo>
                <PreviewTodo
                  text={"vegemakkara"}
                  complete={false}
                ></PreviewTodo>
                <PreviewTodo text={"juusto"} complete={false}></PreviewTodo>
              </div>
              <LandingPoint
                header={"Järjestele tehtäväsi"}
                text={
                  "Luo ja hallitse tehtäväsi helposti pysyäksesi ajan tasalla tehtäväluettelostasi."
                }
              />
            </div>
            <div className="w-full bg-white rounded-md mx-auto mb-8">
              <InviteToListModalPreview></InviteToListModalPreview>
              <LandingPoint
                header={"Kutsu muut listaasi"}
                text={
                  "Kutsu ystäväsi ja perheesi listaasi, jotta voitte suunnitella yhdessä."
                }
              />
            </div>
            <div>
              <h2
                className={`flex text-2xl font-bold mb-2 text-left text-black`}
              >
                <span className={landingStyle.icon}>📜</span>ominaisuudet
              </h2>
              <PreviewTodo
                class="previewTodo"
                text={"Luo useita listoja"}
                complete={true}
              ></PreviewTodo>
              <PreviewTodo
                class="previewTodo"
                text={"Järjestele tehtäväsi"}
                complete={true}
              ></PreviewTodo>
              <PreviewTodo
                class="previewTodo"
                text={"Kutsu muut listaasi"}
                complete={true}
              ></PreviewTodo>

              <div className="animation-container" ref={ref}>
                <animated.div style={animationProps}>
                  <PreviewTodo
                    class="preview-todo"
                    text={"Aloita PuuhaPlannerin käyttö"}
                    complete={false}
                  />
                </animated.div>

                {/* Your other content */}
              </div>
            </div>
            <div className="w-fit mx-auto">
              <button
                onClick={() => navigate("/")}
                class="bg-pink text-white py-2 my-4 px-4 rounded-full font-bold transition duration-300 hover:bg-pink-700"
              >
                Aloita
              </button>
            </div>
          </div>
        </div>
      </div>
      <footer class={landingStyle.footer}>
        <p>&copy; 2023 PuuhaPlanneri</p>
        <p className="text-sm">
          <p className="text-sm flex flex-col my-4">
            <a
              className={`${landingStyle.link} w-fit self-center`}
              href="https://onni.pro"
            >
              Onni Fischer
            </a>{" "}
          </p>
          Tämän sivun suunnittelussa hyödynnetty{" "}
          <a className="text-blue" href="https://webweave.fi">
            Webweavea
          </a>
        </p>
      </footer>
    </>
  );
};
