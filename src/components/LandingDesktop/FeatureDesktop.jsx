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
    <div id="feature-desktop" className="hidden md:block mt-24 mb-16">
      <h2 class="text-left text-3xl text-white font-bold my-5">Ominaisuudet</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-[500px] w-[500px] flex flex-col">
          <div className="h-2/3 bg-white rounded-t-md">
            <div className="p-4 ">
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
          <div className="h-1/3 bg-dogwood rounded-b-md">
            <LandingPoint
              header={"Luo useita listoja"}
              text={
                "Luo useita listoja, jotta voit järjestää tehtäväsi eri kategorioihin."
              }
            />
          </div>
        </div>
        <div className="h-[500px] w-[500px] flex flex-col">
          <div className="h-2/3 bg-white rounded-t-md">
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
          <div className="h-1/3 bg-dogwood rounded-b-md">
            <LandingPoint
              header={"Järjestele tehtäväsi"}
              text={
                "Luo ja hallitse tehtäväsi helposti pysyäksesi ajan tasalla tehtäväluettelostasi."
              }
            />
          </div>
        </div>
        <div className="h-[500px] w-[500px] flex flex-col">
          <div className="h-2/3 bg-white rounded-t-md">
            <InviteToListModalPreview></InviteToListModalPreview>
          </div>
          <div className="h-1/3 bg-dogwood rounded-b-md">
            <LandingPoint
              header={"Kutsu muut listaasi"}
              text={
                "Kutsu ystäväsi ja perheesi listaasi, jotta voitte suunnitella yhdessä."
              }
            />
          </div>
        </div>
        <div className="h-[500px] w-[500px] flex flex-col">
          <div className="h-2/3 bg-white rounded-t-md">
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
                    text={"Aloita PuuhaPlannerin käyttö"}
                    complete={false}
                  />
                </animated.div>
              </div>
            </div>
          </div>

          <div
            onClick={() => navigate("/")}
            className="h-1/3 bg-pink cursor-pointer rounded-b-md shadow-md text-center"
          >
            <p className={`text-white text-3xl font-bold py-16 cursor-pointer`}>
              Aloita
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
