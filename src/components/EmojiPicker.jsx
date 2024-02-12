import React, { useState } from "react";
import { emojis } from "../utils/utils";
import { newListStyle } from "../styles/newListStyle";

const EmojiPicker = (props) => {
  const { setEmojiInTitle } = props;

  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleEmojiClick = (emoji) => {
    setSelectedEmoji(emoji);
    const titleWithEmoji = emoji;
    setEmojiInTitle(titleWithEmoji);
    setIsDropdownOpen(false);
  };

  const handleDeleteClick = () => {
    setSelectedEmoji(null);
    setEmojiInTitle("");
  };

  return (
    <div className="relative">
      <div
        className="border p-2 rounded cursor-pointer"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {selectedEmoji || "valitse ikoni"}
        {selectedEmoji && (
          <button
            className={`absolute top-1 right-0 p-1 text-red-500 hover:text-red-700 ${newListStyle.icon}`}
            onClick={handleDeleteClick}
          >
            ❌
          </button>
        )}
      </div>
      {isDropdownOpen && (
        <div className="absolute top-full left-0 mt-2 p-2 bg-white border rounded shadow-md  flex flex-wrap">
          {emojis.map((emoji, index) => (
            <div
              key={index}
              className="cursor-pointer m-2 text-xl"
              onClick={() => handleEmojiClick(emoji)}
            >
              {emoji}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmojiPicker;
