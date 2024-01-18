import React, { useState } from "react";
import ReactModal from "react-modal";
import { LandingPoint } from "../components/LandingPoint";
import { useNavigate } from "react-router-dom";

export const Landing = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const images = [
    "https://support.content.office.net/en-us/media/81e79f5a-79d6-4a95-8e23-1a8a1f042092.png",
    "https://support.content.office.net/en-us/media/81e79f5a-79d6-4a95-8e23-1a8a1f042092.png",
    "https://support.content.office.net/en-us/media/81e79f5a-79d6-4a95-8e23-1a8a1f042092.png",
  ]; // Replace with your image URLs

  const openModal = (index) => {
    setSelectedImage(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  const style = {
    container:
      "flex flex-col items-center max-w-[500px] w-full h-full m-auto p-2 font-quicksand",
    header: "bg-jade text-white py-8 text-center",
    headerText: "text-4xl font-bold mb-2 flex justify-center items-center",
    h2: "text-darkblue text-2xl font-bold mb-2",
    starter:
      "text-center text-white py-2 px-4 mt-16 rounded-full font-bold transition duration-300 hover:bg-pink-700",
    startButton:
      "bg-pink text-white py-2 mt-8 px-4 rounded-full font-bold transition duration-300 hover:bg-pink-700",
    introduction:
      "text-lg text-white text-center bg-darkblue rounded-md p-8 mx-auto  mb-8",
    link: "w-fit self-center mt-2 cursor-pointer bg-pink text-white py-2 px-4 rounded-full font-bold",
    icon: "transition ease-in-out delay-70 hover:scale-130 duration-70",
    feature: "text-center py-8",
    featureContainer: "w-24 h-24 mx-auto",
    footer: "text-center w-full py-8 bg-darkblue text-white",
    gridImages: " mx-auto gap-4 mt-8 object-cover",
    modal:
      "flex flex-col fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-md shadow-md",
    overlay: "fixed top-0 left-0 w-full h-full bg-black bg-opacity-50",
    pointsContainer: "mt-8",
    plusButton: "border p-4 bg-pink text-black",
    modalImage: "object-cover w-full h-full rounded-md ",
  };

  return (
    <div className={style.container}>
      <header class={style.header}>
        <h1 class={style.headerText}>
          <span className={style.icon}>🍉</span> PuuhaPlanneri
        </h1>
        <p>
          Suunnittele huippuhetket ja tehokas tekeminen – kaikki yhdessä
          paketissa!
        </p>
      </header>
      <div className={style.introduction}>
        <p>
          PuuhaPlanneri on älykäs ja helppokäyttöinen tehtävälistasovellus, joka
          tekee arjen järjestämisestä leikkiä. Käyttäjäystävällinen
          käyttöliittymä, tehokkaat ajanhallintatyökalut ja mahdollisuus nauttia
          jokaisesta hetkestä suunnitelmien toteuttamisen lomassa tekevät
          PuuhaPlannerista ihanteellisen kumppanin tavoitteidesi saavuttamiseen
          hymyssä suin.
        </p>
      </div>
      <div className={style.starter}>
        <p>Järjestele ja ole tuottoisa PuuhaPlannerin avulla</p>

        <button onClick={() => navigate("/")} class={style.startButton}>
          Aloita
        </button>
      </div>
      <div class={style.feature}>
        <div class={style.featureContainer}></div>
        <div className={style.gridImages}>
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Image ${index + 1}`}
              onClick={() => openModal(index)}
            />
          ))}
        </div>
        <div className={style.pointsContainer}>
          <LandingPoint
            header={"Järjestele tehtäväsi"}
            text={
              "Luo ja hallitse tehtäväsi helposti pysyäksesi ajan tasalla tehtäväluettelostasi."
            }
          />
        </div>
      </div>
      <footer class={style.footer}>
        <p>&copy; 2023 PuuhaPlanneri</p>
      </footer>
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Larger Image Modal"
        className={style.modal}
        overlayClassName={style.overlay}
      >
        {selectedImage !== null && (
          <img
            src={images[selectedImage]}
            alt={`Large Image ${selectedImage + 1}`}
            className={style.modalImage}
          />
        )}
        <button onClick={closeModal} className={`${style.link}`}>
          Sulje
        </button>
      </ReactModal>
    </div>
  );
};
