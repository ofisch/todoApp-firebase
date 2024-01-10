import { collection, doc, getDoc, getDocs, query } from "@firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";

export const InvitesModal = ({ userId }) => {
  const [invites, setInvites] = useState([]);

  const style = {
    bg: `w-screen font-quicksand`,
    container: `font-quicksand max-w-[500px] w-full h-full m-auto rounded-md p-4 flex flex-col items-center`,
    bigHeader: "text-4xl flex font-bold mb-4 text-black",
    heading: `text-2xl flex font-bold text-black py-2`,
    form: `flex justify-between`,
    input: `border p-2 my-1 w-full text-xl`,
    button: `border p-4 mt-4 bg-pink text-black w-full`,
    icon: `transition ease-in-out delay-70 hover:scale-130 duration-70`,
    bottom: `flex flex-col items-center gap-2`,
    count: `text-center p-2`,
    deleteAllButton: `flex border p-4 bg-pink`,
    info: `mt-5`,
    link: `text-pink font-bold cursor-pointer`,
  };

  const fetchReceivedInvites = async () => {
    try {
      const receivedInvitesCollectionRef = collection(
        db,
        "users",
        userId,
        "receivedInvites"
      );

      const q = query(receivedInvitesCollectionRef);
      const querySnapshot = await getDocs(q);

      const receivedInvitesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return receivedInvitesData;
    } catch (error) {
      console.log("Error fetching received invites:", error);
      return [];
    }
  };

  useEffect(() => {
    const getReceivedInvites = async () => {
      const receivedInvitesData = await fetchReceivedInvites();
      setInvites(receivedInvitesData);
    };

    getReceivedInvites();
  }, [invites]);

  return (
    <div className="fixed top-1/3 left-1/2 w-3/4 md:w-96 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white p-8 rounded-md shadow-md">
      <>
        <div className="flex justify-between items-baseline">
          <h2 className="text-2xl font-bold mb-4 overflow-auto">kutsut</h2>
        </div>
        <ul>
          {invites.map((invite) => (
            <li className={"w-fit flex justify-around"} key={invite.id}>
              <div className="flex flex-col bg-dogwood">
                <p>
                  kutsu liittyä listaan: <span>{invite.icon}</span>
                  <span className="font-bold">{invite.listName}</span>{" "}
                </p>
                <span>{"käyttäjältä: " + invite.sender}</span>
              </div>
              <button className={style.link}>Liity</button>
            </li>
          ))}
        </ul>
      </>
    </div>
  );
};
