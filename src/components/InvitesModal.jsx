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

export const InvitesModal = ({
  userId,
  toggleInvitesModal,
  fetchUserLists,
}) => {
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
    container: `font-quicksand max-w-[500px] w-full h-full over m-auto rounded-md p-4 flex flex-col items-center`,
    bigHeader: "text-4xl flex font-bold mb-4 text-black",
    heading: `text-2xl flex font-bold text-black py-2`,
    form: `flex justify-between`,
    input: `border p-2 my-1 w-full text-xl`,
    button: `border p-4 mt-4 bg-pink w-24 text-black w-full`,
    icon: `transition ease-in-out delay-70 hover:scale-130 duration-70`,
    bottom: `flex flex-col items-center gap-2`,
    dataLabel: "bg-white font-bold p-1 rounded-md inline-block",
    count: `text-center p-2`,
    deleteAllButton: `flex border p-4 bg-pink`,
    info: `mt-5`,
    link: `text-pink flex font-bold cursor-pointer`,
    listItem: "flex flex-col p-2 gap-4 border bg-dogwood",
    listItemContent: "flex flex-col items-center gap-2 p-2",
    joinDeclineButtons: "flex items-start self-center gap-2",
    joinDeclineButton:
      "transition ease-in-out delay-70 hover:scale-110 duration-70",
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

      const receivedInvitesData =
        querySnapshot && querySnapshot.docs
          ? querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          : [];

      if (receivedInvitesData.length !== 0) {
        return receivedInvitesData;
      } else {
      }
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

      const existingMembers = listMembersQuerySnapshot.docs
        ? listMembersQuerySnapshot.docs.map((doc) => doc.id)
        : [];

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

      console.log("listId: ", listId);

      console.log("userId: ", userId);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();

        console.log("userData: ", userData);

        // Check if "lists" exists in userData and it's an array
        if (userData?.lists && Array.isArray(userData.lists)) {
          const userLists = userData.lists;

          console.log("userLists: ", userLists);

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
              alert("✅ Listaan liitytty!");
              fetchUserLists();
              toggleInvitesModal();
              console.log("Invite deleted from receivedInvites");
            } else {
              console.log("No matching invite found");
            }
          }
        } else {
          const newUserLists = [listId];

          await updateDoc(userDocRef, {
            lists: newUserLists,
          });

          console.log("List joined for the first time");

          const receivedInvitesDocRef = doc(
            db,
            "users",
            userId,
            "receivedInvites",
            inviteId
          );

          await deleteDoc(receivedInvitesDocRef);
          // lisätään käyttäjä jäseneksi listaan

          // päivitetään käyttäjän kutsut sivulla
          fetchReceivedInvites();
          alert("✅ Listaan liitytty!");
          fetchUserLists();
          toggleInvitesModal();
          console.log("Invite deleted from receivedInvites");
        }
      }
    } catch (error) {
      console.log("Error joining list:", error);
    }
  };

  const declineInvite = async (inviteId) => {
    try {
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
        // päivitetään käyttäjän kutsut sivulla
        fetchReceivedInvites();
        alert("❌ Kutsu hylätty!");
        toggleInvitesModal();
      } else {
        console.log("No matching invite found");
      }
    } catch (error) {
      console.log("Error declining invite:", error);
    }
  };

  return (
    <div className="fixed top-1/3 lg:top-1/3 left-1/2 w-3/4 md:w-96 lg:w-fit max-h-80 overflow-auto transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white p-8 rounded-md shadow-md">
      <>
        <div className="flex justify-between items-baseline">
          <h2 className="text-2xl font-bold mb-4 overflow-auto">Kutsut</h2>
        </div>
        <ul className="flex flex-col gap-4 ">
          {invites ? (
            invites.map((invite) => (
              <li className={style.listItem} key={invite.id}>
                <div className={style.listItemContent}>
                  <p className="text-center">
                    <span
                      className={`${style.dataLabel} ${style.dogwood} font-bold mb-2`}
                    >
                      kutsu käyttäjältä
                    </span>
                    <br />
                    <span className="font-semibold text-xl">
                      {invite.sender}
                    </span>
                  </p>
                  <p className="text-center">
                    <span
                      className={`${style.dataLabel} ${style.dogwood} font-bold mb-2`}
                    >
                      listaan
                    </span>{" "}
                    <br />
                    <span className="font-semibold text-xl flex">
                      <span className={style.icon}>{invite.icon}</span>{" "}
                      {invite.listName}
                    </span>
                  </p>
                </div>
                <div className={style.joinDeclineButtons}>
                  <button
                    onClick={() => joinList(invite.id)}
                    className={style.button}
                  >
                    <span className={style.icon}>🔗</span> Liity
                  </button>

                  <button
                    onClick={() => declineInvite(invite.id)}
                    className={`${style.button}`}
                  >
                    {" "}
                    <p className="">
                      <span className={style.icon}>❌</span>Hylkää
                    </p>
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p>Ei kutsuja</p>
          )}
        </ul>
      </>
    </div>
  );
};
