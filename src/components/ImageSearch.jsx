import React, { useEffect, useRef, useState } from "react";
import { modalStyle } from "../styles/modalStyle";
import { API_KEY, DEEPL_API_KEY } from "../secret";
import axios from "axios";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const API_URL = "https://api.unsplash.com/search/photos";
const IMAGES_PER_PAGE = 10;

const DEEPL_API_URL = "https://api-free.deepl.com/v2/translate";

export const ImageSearch = ({ toggleImgSearch, toggleColorModal, id }) => {
  const searchInput = useRef(null);

  const [images, setImages] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const [selectedImage, setSelectedImage] = useState(null);

  const [bgColor, setBgColor] = useState(localStorage.getItem("bgColor") || "");

  const fetchImages = async (search) => {
    try {
      const { data } = await axios.get(
        `${API_URL}?query=${search}&page=1&per_page=${IMAGES_PER_PAGE}&client_id=${API_KEY}`
      );
      setImages(data.results);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error(error);
    }
  };

  const translateText = async (text) => {
    try {
      const { data } = await axios.post(
        `${DEEPL_API_URL}?auth_key=${DEEPL_API_KEY}&text=${text}&target_lang=EN`
      );
      return data.translations[0].text;
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    translateText(searchInput.current.value).then((translatedText) => {
      fetchImages(translatedText);
    });
  };

  const saveBgImage = async (image) => {
    const listDocRef = doc(db, "lists", id);

    try {
      await updateDoc(listDocRef, { bgColor: image }, { merge: true });
      localStorage.setItem("bgImage", image);
      localStorage.setItem("bgColor", image);
      setBgColor(image);
      document.body.style = `background-image: url(${image}); background-repeat: round;`; // Set backgroundImage for images
      document.body.style.backgroundColor = "transparent";

      alert("✅ Listan taustakuva vaihdettu!");
      toggleColorModal();
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const selectImage = (image) => {
    setSelectedImage(image);
    saveBgImage(image);
  };

  useEffect(() => {
    setBgColor(localStorage.getItem("bgColor") || "");
  }, []);

  return (
    <div className="fixed top-1/3 left-1/2 w-3/4 max-w-[500px] max-h-[500px] md:w-96 overflow-auto transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-md shadow-md">
      <div className="flex justify-between items-baseline px-8 pt-4 sticky top-0 bg-white z-10">
        <h2 className="text-2xl font-bold mb-4 overflow-auto">
          <button onClick={toggleImgSearch} className=" text-pink">
            <span>&#8592;</span>
          </button>
          Hae taustakuvaa
        </h2>
        <button onClick={toggleColorModal} className={modalStyle.closeButton}>
          X
        </button>
      </div>

      <div className="px-8">
        <form onSubmit={handleSearch}>
          <input
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
            type="text"
            ref={searchInput}
          />
        </form>
      </div>
      <div id="results" className="p-8">
        {images.map((image) => (
          <img
            key={image.id}
            src={image.urls.small}
            alt={image.alt_description}
            className="w-full h-36 object-cover my-2 rounded-md cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300"
            onClick={() => selectImage(image.urls.full)}
          />
        ))}
      </div>
    </div>
  );
};
