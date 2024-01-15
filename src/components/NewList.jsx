import React, { useState } from "react";
import { newListStyle } from "../styles/newListStyle";
import EmojiPicker from "./EmojiPicker";

export const NewList = (props) => {
  const { addNewList } = props;

  const [emojiInTitle, setEmojiInTitle] = useState("");
  const [name, setName] = useState("");

  return (
    <div className="fixed top-1/3 left-1/2 w-3/4 md:w-96 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white p-8 rounded-md shadow-md">
      <>
        <div className="flex justify-between items-baseline">
          <h2 className="text-2xl font-bold mb-4 overflow-auto">
            {name || emojiInTitle
              ? `Luo uusi lista - ${emojiInTitle} ${name}`
              : "Luo uusi lista"}
          </h2>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            Ikoni
          </label>
          <EmojiPicker
            emojiInTitle={emojiInTitle}
            setEmojiInTitle={setEmojiInTitle}
            name={name}
            setName={setName}
          />
          <label className="block text-sm font-semibold text-gray-600 mt-2 mb-2">
            Nimi <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
            type="text"
            spellCheck="false"
            placeholder="listan nimi"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <button
          onClick={() => addNewList(emojiInTitle, name)}
          className={newListStyle.button}
        >
          <p className="font-bold">Luo</p>
        </button>
      </>
    </div>
  );
};
