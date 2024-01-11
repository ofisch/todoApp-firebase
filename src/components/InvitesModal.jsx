import {
  collection,
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  where,
  setDoc,
  addDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";

export const InvitesModal = ({ userId }) => {
  const [invites, setInvites] = useState([]);

  const [listIdToJoin, setListIdToJoin] = useState("");

  const getListIdToJoin = async (inviteId) => {
    try {
      const receivedInvitesDocRef = doc(
        db,
        "users",
        userId,
        "receivedInvites",
        inviteId
      );

      const docSnapshot = await getDoc(receivedInvitesDocRef);

      if (docSnapshot.exists()) {
        // Access the "listId" field from the document data
        return docSnapshot.data().listId;
      } else {
        console.log("No matching invite found");
        return null;
      }
    } catch (error) {
      console.log("Error getting invite:", error);
      return null;
    }
  };

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
  }, []);

  const getUserData = async () => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        return userData;
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (error) {
      console.log("Error getting document:", error);
      return null;
    }
  };

  const addNewMemberToList = async (inviteId) => {
    try {
      const listId = await getListIdToJoin(inviteId);

      const listMembersCollectionRef = collection(
        db,
        "lists",
        listId,
        "members"
      );
      const listMembersQuerySnapshot = await getDocs(listMembersCollectionRef);

      const existingMembers = listMembersQuerySnapshot.docs.map(
        (doc) => doc.id
      );

      const userData = await getUserData();

      console.log("userData: ", userData);

      if (!existingMembers.includes(userId)) {
        await setDoc(doc(listMembersCollectionRef, userId), {
          email: userData.email,
          nickname: userData.nickname,
        });

        console.log("New member added to list");
      }
    } catch (error) {
      console.log("Error adding new member to list:", error);
    }
  };

  const joinList = async (inviteId) => {
    try {
      const listId = await getListIdToJoin(inviteId);

      const userDocRef = doc(db, "users", userId);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();

        // Check if "lists" exists in userData and it's an array
        if (userData?.lists && Array.isArray(userData.lists)) {
          const userLists = userData.lists;

          if (!userLists.includes(listId)) {
            userLists.push(listId);

            await updateDoc(userDocRef, {
              lists: userLists,
            });

            console.log("List joined");

            await addNewMemberToList(inviteId);

            const receivedInvitesDocRef = doc(
              db,
              "users",
              userId,
              "receivedInvites",
              inviteId
            );

            const invitesSnapshot = await getDoc(receivedInvitesDocRef);

            console.log("data: ", invitesSnapshot.data());

            if (invitesSnapshot.exists()) {
              // poistetaan kutsu käyttäjän kutsut-kokoelmasta
              await deleteDoc(receivedInvitesDocRef);
              // lisätään käyttäjä jäseneksi listaan

              // päivitetään käyttäjän kutsut sivulla
              fetchReceivedInvites();
              console.log("Invite deleted from receivedInvites");
            } else {
              console.log("No matching invite found");
            }
          }
        }
      }
    } catch (error) {
      console.log("Error joining list:", error);
    }
  };

  return (
    <div className="fixed top-1/3 left-1/2 w-3/4 md:w-96 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white p-8 rounded-md shadow-md">
      <>
        <div className="flex justify-between items-baseline">
          <h2 className="text-2xl font-bold mb-4 overflow-auto">kutsut</h2>
        </div>
        <ul>
          {invites.map((invite) => (
            <li
              className={"w-fit flex justify-around bg-dogwood"}
              key={invite.id}
            >
              <div className="flex flex-col ">
                <h3 className="font-bold">Liittymiskutsu</h3>
                <p>
                  listaan <span>{invite.icon}</span>
                  <span className="font-bold">{invite.listName}</span>{" "}
                </p>
                <p>
                  käyttäjältä{" "}
                  <span className="font-bold"> {invite.sender}</span>
                </p>
              </div>
              <div className="flex flex-col self-center ml-4 gap-2">
                <button
                  onClick={() => joinList(invite.id)}
                  className={style.link}
                >
                  <span className={style.icon}>🔗</span> Liity
                </button>

                <button className={style.link}>
                  {" "}
                  <span className={style.icon}>❌</span>Hylkää
                </button>
              </div>
            </li>
          ))}
        </ul>
      </>
    </div>
  );
};
