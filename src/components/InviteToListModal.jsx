import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../firebase";

export const InviteToListModal = ({
  ownerId,
  listInfo,

  getUserNicknameById,
  getUserIdByNickname,
  toggleShowInviteToListModal,
}) => {
  const style = {
    bg: `w-screen font-quicksand`,
    container: `font-quicksand max-w-[500px] w-full h-full m-auto rounded-md p-4 flex flex-col items-center`,
    bigHeader: "text-4xl flex font-bold mb-4 text-black",
    heading: `text-2xl flex font-bold text-black py-2`,
    form: `flex justify-between`,
    input: `border p-2 my-1 w-full text-xl`,
    button: `border p-4 mt-4 bg-pink text-black w-full`,
    closeButton: `absolute top-2 right-4 text-2xl text-pink font-bold`,
    icon: `transition ease-in-out delay-70 hover:scale-130 duration-70`,
    bottom: `flex flex-col items-center gap-2`,
    count: `text-center p-2`,
    deleteAllButton: `flex border p-4 bg-pink`,
    info: `mt-5`,
    link: `text-pink font-bold cursor-pointer`,
  };

  const [inviteeNickname, setInviteeNickname] = useState("");

  // TODO: siirrä funktiot ListView.jsx:ään,
  // jotta modal voidaan sulkea kun kutsu on lähetetty

  const sendInvite = async (nickname) => {
    try {
      const inviteeId = await getUserIdByNickname(nickname);

      const inviter = await getUserNicknameById(listInfo.owner);

      if (inviteeId) {
        const inviteData = {
          listId: listInfo.id,
          listName: listInfo.name,
          icon: listInfo.icon,
          sender: inviter,
        };

        const receivedInvitesCollectionRef = collection(
          db,
          "users",
          inviteeId,
          "receivedInvites"
        );
        await addDoc(receivedInvitesCollectionRef, inviteData);
        alert(`✅ Käyttäjä ${nickname} kutsuttu listalle!`);
        setInviteeNickname("");
        toggleShowInviteToListModal();
      }
    } catch (error) {
      console.error("Error sending invite:", error);
    }
  };

  return (
    <div className="font-quicksand fixed top-1/3 left-1/2 w-3/4 md:w-96 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white p-8 rounded-md shadow-md">
      <>
        <div className="flex flex-col justify-between">
          <h2 className="text-2xl font-bold mb-4 overflow-auto">
            Kutsu käyttäjä listaan: <br />
            {listInfo.icon + listInfo.name}
          </h2>
          <button
            onClick={toggleShowInviteToListModal}
            className={style.closeButton}
          >
            X
          </button>
          <div className="mb-4 text-lg">
            <label className="block text-sm font-semibold text-gray-600 mt-2 mb-2">
              Kutsuttavan käyttäjätunnus <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
              type="text"
              spellCheck="false"
              placeholder="käyttäjätunnus"
              value={inviteeNickname}
              onChange={(e) => setInviteeNickname(e.target.value)}
            />
          </div>
          <button
            onClick={() => sendInvite(inviteeNickname)}
            className={style.button}
          >
            <p className="font-bold">Kutsu</p>
          </button>
        </div>
      </>
    </div>
  );
};
