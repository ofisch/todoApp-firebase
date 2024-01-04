import React, { useState } from "react";
import { newListStyle } from "../styles/newListStyle";
import EmojiPicker from "./EmojiPicker";

export const NewList = () => {
  const [emojiInTitle, setEmojiInTitle] = useState("");
  const [name, setName] = useState("");

  const [userName, setUserName] = useState("");
  // identityNumber on ERI kuin listan id firestoressa.
  const [listIdentityNumber, setListIdentityNumber] = useState("");

  // false = create new list
  // true = join existing list
  const [newListMode, setNewListMode] = useState(false);

  const toggleNewListMode = () => {
    setNewListMode(!newListMode);
  };

  return (
    <div className="fixed top-1/3 left-1/2 w-3/4 md:w-96 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white p-8 rounded-md shadow-md">
      {newListMode !== true ? (
        <>
          <div className="flex justify-between items-baseline">
            <h2 className="text-2xl font-bold mb-4 overflow-auto">
              {name || emojiInTitle
                ? `Luo uusi lista - ${emojiInTitle} ${name}`
                : "Luo uusi lista"}
            </h2>
            {name || emojiInTitle ? null : (
              <button
                onClick={toggleNewListMode}
                className={`${newListStyle.link} flex`}
              >
                <span className={newListStyle.icon}>🔗</span>Liity listaan
              </button>
            )}
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
          <button className={newListStyle.button}>
            <p className="font-bold">Luo</p>
          </button>
        </>
      ) : (
        <>
          <div className="flex justify-between items-baseline">
            <h2 className="text-2xl font-bold mb-4 overflow-auto">
              Liity listaan
            </h2>
            {name || emojiInTitle ? null : (
              <button
                onClick={toggleNewListMode}
                className={`${newListStyle.link} flex`}
              >
                <span className={newListStyle.icon}>➕</span>Luo uusi lista
              </button>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-600 mt-2 mb-2">
              Listan omistajan käyttäjätunnus{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
              type="text"
              placeholder="käyttäjätunnus"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <label className="block text-sm font-semibold text-gray-600 mt-2 mb-2">
              Listan tunnus <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
              type="text"
              placeholder="listan tunnus"
              value={listIdentityNumber}
              onChange={(e) => setListIdentityNumber(e.target.value)}
            />
          </div>
          <button className={newListStyle.button}>
            <p className="font-bold">Lähetä pyyntö</p>
          </button>
        </>
      )}
    </div>
  );
};
