import React from "react";
import { ListElement } from "../ListElement";
import { LandingPoint } from "../LandingPoint";
import PreviewTodo from "../PreviewTodo";
import { landingStyle } from "../../styles/landingStyle";
import { InviteToListModalPreview } from "../InviteToListModalPreview";

export const FeatureDesktop = ({
  refDesktop,
  animationPropsDesktop,
  navigate,
  animated,
}) => {
  return (
    <div id="feature-desktop" className="hidden md:block mb-16 w-full">
      <div className="flex flex-col gap-4">
        <div style={{ borderRadius: "5px" }} className="flex w-full bg-white">
          <div className="w-1/2 flex flex-col">
            <div className="bg-white w-full"></div>
            <div className="p-4">
              <h2
                className={`flex text-2xl font-bold mb-2 text-left text-black`}
              >
                Listat
              </h2>
              <ListElement icon={"🍉"} name={"ostoslista"}></ListElement>
              <ListElement icon={"📝"} name={"opiskelu"}></ListElement>
              <ListElement icon={"📚"} name={"luettavat kirjat"}></ListElement>
              <ListElement icon={"🗓️"} name={"päivän tehtävät"}></ListElement>
            </div>
          </div>
          <div style={{ borderRadius: "5px" }} className="w-1/2 bg-dogwood">
            <LandingPoint
              header={"Luo useita listoja"}
              text={
                "Luo useita listoja, jotta voit järjestää tehtäväsi eri kategorioihin."
              }
            />
          </div>
        </div>

        <div className="flex w-full bg-white">
          <div className="w-1/2 bg-dogwood">
            <LandingPoint
              header={"Järjestele tehtäväsi"}
              text={
                "Luo ja hallitse tehtäväsi helposti pysyäksesi ajan tasalla tehtäväluettelostasi."
              }
            />
          </div>
          <div className="w-1/2 flex flex-col">
            <div className="bg-white w-full"></div>
            <div className="p-4">
              <h2
                className={`flex text-2xl font-bold mb-2 text-left text-black`}
              >
                <span className={landingStyle.icon}>🍉</span>ostoslista
              </h2>
              <PreviewTodo text={"kaurajuoma"} complete={true}></PreviewTodo>
              <PreviewTodo text={"kurkku"} complete={true}></PreviewTodo>
              <PreviewTodo text={"vegemakkara"} complete={false}></PreviewTodo>
              <PreviewTodo text={"juusto"} complete={false}></PreviewTodo>
            </div>
          </div>
        </div>

        <div className="flex w-full bg-white">
          <div className="w-1/2 flex flex-col">
            <InviteToListModalPreview></InviteToListModalPreview>
          </div>
          <div className="w-1/2 bg-dogwood">
            <LandingPoint
              header={"Kutsu muut listaasi"}
              text={
                "Kutsu ystäväsi ja perheesi listaasi, jotta voitte suunnitella yhdessä."
              }
            />
          </div>
        </div>

        <div className="flex w-full bg-white">
          <div
            onClick={() => navigate("/")}
            className="w-1/2 bg-pink cursor-pointer shadow-md flex justify-center items-center"
          >
            <p className="text-white text-3xl font-bold py-16 cursor-pointer">
              Aloita
            </p>
          </div>

          <div className="w-1/2 bg-white">
            <div className="p-4">
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

              <div className="animation-container" ref={refDesktop}>
                <animated.div style={animationPropsDesktop}>
                  <PreviewTodo
                    class="preview-todo"
                    text={"Aloita PuuhaPlannerin käyttö!"}
                    complete={false}
                  />
                </animated.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
