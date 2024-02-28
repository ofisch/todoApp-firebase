import React, { useState } from "react";
import { auth, db } from "../firebase";
import { modalStyle } from "../styles/modalStyle";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { ImageSearch } from "./ImageSearch";

export const ThemeModalList = ({ toggleColorModal, id }) => {
  const [color, setColor] = useState(
    localStorage.getItem("bgColor")?.includes("#") ||
      localStorage.getItem("bgColor")?.includes("gradient")
      ? localStorage.getItem("bgColor")
      : "#ffffff"
  ); // Initial color

  const user = auth.currentUser;

  const handleChangeColor = (event) => {
    setColor(event.target.value);
  };

  const handleSaveColor = () => {
    // Save color change logic goes here
    console.log("New color:", color);
    // Close the modal after saving the color
    toggleColorModal();
  };

  const colors = {
    jade: "#04A777",
    pictonblue: "#00A7E1",
    midnightgreen: "#114B5F",
    lavenderpink: "#E6AACE",
    mindaro: "#E6F9AF",
    bluegradient:
      "linear-gradient(180deg, hsla(217, 100%, 50%, 1) 0%, hsla(186, 100%, 69%, 1) 100%)",
    greengradient:
      "linear-gradient(180deg, hsla(152, 100%, 50%, 1) 0%, hsla(186, 100%, 69%, 1) 100%)",
    yellowgradient:
      "linear-gradient(180deg, hsla(33, 100%, 53%, 1) 0%, hsla(58, 100%, 68%, 1) 100%)",
  };

  const saveColor = async (color) => {
    const listDocRef = doc(db, "lists", id);

    console.log("color: ", color);

    try {
      await updateDoc(listDocRef, { bgColor: color }, { merge: true });
      localStorage.setItem("bgColor", color);

      if (color.includes("gradient")) {
        document.body.style = `background: ${color}`; // Set backgroundImage for gradient colors
        document.body.style.backgroundColor = "transparent"; // Set backgroundColor to transparent for gradients
      } else {
        document.body.style = ""; // Clear backgroundImage for solid colors
        document.body.style.backgroundColor = color; // Set backgroundColor for solid colors
      }

      toggleColorModal();
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const saveTextColor = async (color) => {
    const listDocRef = doc(db, "lists", id);

    console.log("color: ", color);

    try {
      await updateDoc(listDocRef, { textColor: color }, { merge: true });
      localStorage.setItem("textColor", color);

      toggleColorModal();
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const saveChanges = async (bg, textColor) => {
    try {
      alert("✅ Muutokset tallennettu!");
      if (bg !== "#ffffff") {
        await saveColor(bg);
      }
      await saveTextColor(textColor);
      await saveListingColor(listingColor);
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  // otsikkoväri

  const [textColor, setTextColor] = useState(
    localStorage.getItem("textColor") || "#000000"
  ); // Initial color

  const textColors = {
    white: "#ffffff",
    black: "#000000",
    pictonblue: "#00A7E1",
    midnightgreen: "#114B5F",
    lavenderpink: "#E6AACE",
  };

  const handleChangeTextColor = (event) => {
    setTextColor(event.target.value);
  };

  const [imgSearch, setImgSearch] = useState(false);

  const toggleImgSearch = () => {
    setImgSearch(!imgSearch);
  };

  // listauksen väri

  const [listingColor, setListingColor] = useState(
    localStorage.getItem("listingColor") || "#D3BDB0"
  );

  const listingColors = {
    jade: "#04A777",
    dogwood: "#D3BDB0",
    pictonblue: "#00A7E1",
    midnightgreen: "#114B5F",
    lavenderpink: "#E6AACE",
  };

  const handleChangeListingColor = (event) => {
    setListingColor(event.target.value);
  };

  const saveListingColor = async (color) => {
    const listDocRef = doc(db, "lists", id);

    console.log("color: ", color);

    try {
      await updateDoc(listDocRef, { listingColor: color }, { merge: true });
      localStorage.setItem("listingColor", color);

      toggleColorModal();
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  return (
    <>
      {!imgSearch ? (
        <div className="fixed top-1/3 left-1/2 w-3/4 md:w-96 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white p-8 rounded-md shadow-md">
          <h2 className="text-2xl font-bold mb-4 overflow-auto">
            Listan teema
          </h2>
          <button onClick={toggleColorModal} className={modalStyle.closeButton}>
            X
          </button>
          <div>
            <div>
              <h2 className={`font-semibold text-xl my-4 overflow-auto`}>
                Taustaväri
              </h2>
              <ul className="flex overflow-auto rounded-md">
                {Object.keys(colors).map((colorName) => (
                  <li key={colorName}>
                    <label>
                      <input
                        type="radio"
                        name="color"
                        value={colors[colorName]}
                        checked={color === colors[colorName]}
                        onChange={handleChangeColor}
                        style={{ display: "none" }} // Hide the radio button
                      />
                      <span
                        className={`ml-2 rounded-full border-4 ${
                          color === colors[colorName]
                            ? "border-gray-400"
                            : "border-transparent"
                        }`}
                        style={{
                          width: "50px",
                          height: "50px",
                          display: "inline-block",
                          cursor: "pointer", // Add cursor pointer
                          backgroundImage: colorName.includes("gradient")
                            ? colors[colorName]
                            : "none",
                          backgroundColor: colorName.includes("gradient")
                            ? "transparent"
                            : colors[colorName],
                        }}
                        onClick={() => setColor(colors[colorName])}
                      ></span>
                    </label>
                  </li>
                ))}
              </ul>
              <h2 className={`font-semibold text-xl my-4 overflow-auto`}>
                Taustakuva
              </h2>
              <div
                className={`ml-2 rounded-full flex bg-sky-400 justify-center border-4 items-center ${
                  localStorage.getItem("bgColor").includes("https")
                    ? "border-gray-400"
                    : "border-transparent"
                }`} // Flexbox centering
                style={{
                  width: "50px",
                  height: "50px",
                  cursor: "pointer", // Add cursor pointer
                }}
                onClick={toggleImgSearch}
              >
                <span className="text-white text-2xl">🔎</span>
              </div>
              <div>
                <h2 className={`font-semibold text-xl my-4 overflow-auto`}>
                  Otsikon väri
                </h2>
                <ul className="flex overflow-auto rounded-md py-2">
                  {Object.keys(textColors).map((colorName) => (
                    <li key={colorName} className="">
                      <label>
                        <input
                          type="radio"
                          name="textColor"
                          value={textColors[colorName]}
                          checked={textColor === textColors[colorName]}
                          onChange={handleChangeTextColor}
                          style={{ display: "none" }} // Hide the radio button
                        />
                        <span
                          className={`ml-2 rounded-full ${
                            textColor === textColors[colorName]
                              ? "border-gray-400 border-4"
                              : ""
                          } ${
                            colorName === "white" && textColor === "#ffffff"
                              ? "border-gray-400 border-5"
                              : colorName === "white" && textColor !== "#ffffff"
                              ? "border-gray-700 border-4"
                              : ""
                          } `}
                          style={{
                            width: "50px",
                            height: "50px",
                            display: "inline-block",
                            cursor: "pointer", // Add cursor pointer
                            backgroundColor: textColors[colorName],
                          }}
                          onClick={() => setTextColor(textColors[colorName])}
                        ></span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className={`font-semibold text-xl my-4 overflow-auto`}>
                  Listauksen väri
                </h2>
                <ul className="flex overflow-auto rounded-md py-2">
                  {Object.keys(listingColors).map((colorName) => (
                    <li key={colorName} className="">
                      <label>
                        <input
                          type="radio"
                          name="listingColor"
                          value={listingColors[colorName]}
                          checked={listingColor === listingColors[colorName]}
                          onChange={handleChangeListingColor}
                          style={{ display: "none" }} // Hide the radio button
                        />
                        <span
                          className={`ml-2 rounded-full border-4 ${
                            listingColor === listingColors[colorName]
                              ? "border-gray-400"
                              : "border-transparent"
                          } ${
                            colorName === "white" && textColor === "#ffffff"
                              ? "border-gray-400 border-5"
                              : colorName === "white" && textColor !== "#ffffff"
                              ? "border-gray-800 border-2"
                              : ""
                          } `}
                          style={{
                            width: "50px",
                            height: "50px",
                            display: "inline-block",
                            cursor: "pointer", // Add cursor pointer
                            backgroundColor: listingColors[colorName],
                          }}
                          onClick={() =>
                            setListingColor(listingColors[colorName])
                          }
                        ></span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  saveChanges(color, textColor);
                }}
                className={`${modalStyle.button} mr-2`}
              >
                Tallenna
              </button>
              <button onClick={toggleColorModal} className={modalStyle.button}>
                Peruuta
              </button>
            </div>
          </div>
        </div>
      ) : (
        <ImageSearch
          toggleImgSearch={toggleImgSearch}
          toggleColorModal={toggleColorModal}
          id={id}
        />
      )}
    </>
  );
};
