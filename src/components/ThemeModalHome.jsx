import React, { useState } from "react";
import { modalStyle } from "../styles/modalStyle";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export const ThemeModalHome = ({ toggleColorModal }) => {
  const [color, setColor] = useState("#ffffff"); // Initial color

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
  };

  const saveColor = async (color) => {
    const userDocRef = doc(db, "users", user.uid);

    try {
      // Check if the user document exists
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        // If the user document exists, update the "color" field
        await updateDoc(userDocRef, {
          color: color,
        });
        alert("✅ Väri tallennettu!");
        toggleColorModal();
        document.body.style.backgroundColor = color;
      } else {
        // If the user document doesn't exist, create a new one with the "color" field
        await setDoc(userDocRef, {
          color: color,
        });
        console.log("New user document created with color:", color);
      }
    } catch (error) {
      console.error("Error saving color:", error);
    }
  };

  return (
    <>
      <div className="fixed top-1/3 left-1/2 w-3/4 md:w-96 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white p-8 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-4 overflow-auto">
          Kotinäkymän teema
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
                          ? "border-blue-500"
                          : "border-transparent"
                      }`}
                      style={{
                        backgroundColor: colors[colorName],
                        width: "50px",
                        height: "50px",
                        display: "inline-block",
                        cursor: "pointer", // Add cursor pointer
                      }}
                      onClick={() => setColor(colors[colorName])}
                    ></span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => saveColor(color)}
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
    </>
  );
};
