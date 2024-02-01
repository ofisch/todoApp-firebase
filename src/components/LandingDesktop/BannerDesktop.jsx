import React from "react";
import { landingStyle } from "../../styles/landingStyle";

export const BannerDesktop = ({ navigate }) => {
  return (
    <div id="desktop-banner" className="hidden md:flex gap-8 max-w-[1200px]">
      <div>
        <p
          className={`text-center text-white text-2xl md:text-4xl mt-4 font-bold`}
        >
          Suunnittele huippuhetket ja tehokas tekeminen - kaikki yhdessä
          paketissa!
        </p>
        <div className={landingStyle.starter}>
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
      <div id="parallax-container" className={`${landingStyle.introduction}`}>
        <div class="parallax-layer" id="layer1">
          📝
        </div>
        <div class="parallax-layer" id="layer2">
          📌
        </div>
        <div className={landingStyle.introHeader}>
          <h3 className={"text-black text-2xl"}>
            PuuhaPlanneri on <span className="font-bold">älykäs</span> ja{" "}
            <span className="font-bold">helppokäyttöinen </span>
            tehtävälistasovellus, joka tekee arjen järjestämisestä leikkiä.
          </h3>
        </div>

        <p className="mt-14">
          Käyttäjäystävällinen käyttöliittymä, tehokkaat ajanhallintatyökalut ja
          mahdollisuus nauttia jokaisesta hetkestä suunnitelmien toteuttamisen
          lomassa tekevät PuuhaPlannerista ihanteellisen kumppanin tavoitteidesi
          saavuttamiseen hymyssä suin.
        </p>
      </div>
    </div>
  );
};
