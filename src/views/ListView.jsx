import {
  FieldValue,
  addDoc,
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { auth, db } from "../firebase";
import { listStyle } from "../styles/listStyle";
import Todo from "../components/Todo";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MembersModal } from "../components/MembersModal";
import { InviteToListModal } from "../components/InviteToListModal";
import { onAuthStateChanged } from "firebase/auth";
import { ThemeModalList } from "../components/ThemeModalList";

export const ListView = () => {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");
  const [listInfo, setListInfo] = useState({});

  const [userId, setUserId] = useState("");
  const [userNickname, setUserNickname] = useState("");

  const { id } = useParams();

  const navigate = useNavigate();

  if (localStorage.getItem("textColor") === undefined) {
    localStorage.setItem("textColor", "#000000");
  }

  // tarkistetaan käyttäjän sessio, jotta url-osoitteen kautta ei pääse katsomaan listaa
  const checkUserSession = async () => {
    const user = auth.currentUser;
    try {
      if (!user) {
        setUserId(null);

        return;
      }
      setUserId(user.uid);
    } catch (error) {
      console.error("Error checking user membership:", error);
    }
  };

  const exitIfNotMember = async () => {
    try {
      const listDocRef = doc(db, "lists", id);
      const listDocSnapshot = await getDoc(listDocRef);

      if (listDocSnapshot.exists()) {
        const membersCollectionRef = collection(db, "lists", id, "members");
        const membersSnapshot = await getDocs(membersCollectionRef);

        const members = [];

        membersSnapshot.forEach((member) => {
          members.push(member.id);
        });

        const user = auth.currentUser;

        if (!members.includes(user.uid)) {
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Error checking user membership:", error);
    }
  };

  const getListInfo = async () => {
    try {
      const listDocRef = doc(db, "lists", id);
      const listDocSnapshot = await getDoc(listDocRef);

      if (listDocSnapshot.exists()) {
        setListInfo(listDocSnapshot.data());
      }
    } catch (error) {
      console.error("Error getting list info:", error);
    }
  };

  // haetaan itemit listan id:n perusteella
  const fetchItems = () => {
    try {
      const itemsCollectionRef = collection(db, "lists", id, "items");

      const unsubscribe = onSnapshot(itemsCollectionRef, (querySnapshot) => {
        const itemsArr = [];

        querySnapshot.forEach((itemDoc) => {
          itemsArr.push({ ...itemDoc.data(), id: itemDoc.id });
        });

        setItems(itemsArr);
      });

      return unsubscribe;
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    checkUserSession();
    getListInfo();
    const unsubscribe = fetchItems(); // kutsutaan funktiota itemien hakemiseen

    return () => {
      unsubscribe();
    };
  }, [id]);

  useEffect(() => {
    exitIfNotMember();
  }, [userId]);

  const addToLog = async (message) => {
    try {
      const listDocRef = doc(db, "lists", id);

      const listDocSnapshot = await getDoc(listDocRef);
      if (listDocSnapshot.exists()) {
        const currentLog = listDocSnapshot.data().log || [];

        // lisätään uusi viesti lokiin
        const updatedLog = [message, ...currentLog];

        const limitedLog = updatedLog.slice(0, 30);

        // päivitetään loki
        await updateDoc(listDocRef, { log: limitedLog });
      } else {
        await setDoc(listDocRef, { log: [message] });
      }
    } catch (error) {
      console.error("Error adding to log:", error);
    }
  };

  // luo uuden listauksen
  const createTodo = async (e) => {
    e.preventDefault();
    if (input === "") {
      alert("Tyhjä listaus");
      return;
    }

    try {
      const itemsCollectionRef = collection(db, "lists", id, "items");
      const newTodoDocRef = await addDoc(itemsCollectionRef, {
        text: input,
        completed: false,
      });

      // uuden listauksen id
      const newTodoId = newTodoDocRef.id;

      // haetaan olemassa olevat listaukset
      const existingItems = [...items];

      // lisätään uusi listaus olemassa olevien listauksien eteen
      const updatedItems = [
        { id: newTodoId, text: input, completed: false },
        ...existingItems,
      ];

      // päivitetään listaukset
      setItems(updatedItems);

      setInput("");

      // lisätään lokiin tieto uudesta listauksesta
      addToLog("✅ " + userNickname + " lisäsi listauksen: " + input);
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  const toggleComplete = async (itemId) => {
    try {
      const itemDocRef = doc(db, "lists", id, "items", itemId);
      const itemDocSnapshot = await getDoc(itemDocRef);

      if (itemDocSnapshot.exists()) {
        const itemData = itemDocSnapshot.data();
        await updateDoc(itemDocRef, {
          completed: !itemData.completed,
        });
      } else {
        console.error("Item not found");
      }
    } catch (error) {
      console.error("Error toggling complete:", error);
    }
  };

  const editTodo = async (itemId, newText) => {
    try {
      const itemDocRef = doc(db, "lists", id, "items", itemId);
      const itemDocSnapshot = await getDoc(itemDocRef);

      if (itemDocSnapshot.exists()) {
        const itemData = itemDocSnapshot.data();
        await updateDoc(itemDocRef, {
          text: newText,
        });
        // lisätään lokiin tieto listauksen muokkauksesta
        addToLog(
          "✏️ " +
            userNickname +
            " muokkasi listauksen: " +
            itemData.text +
            " ➡️ " +
            newText
        );
      } else {
        console.error("Item not found");
      }
    } catch (error) {
      console.error("Error toggling complete:", error);
    }
  };

  const deleteTodo = async (todoId, isBulkDeletion = false) => {
    try {
      const itemDocRef = doc(db, "lists", id, "items", todoId);

      const itemDocSnapshot = await getDoc(itemDocRef);

      const itemText = itemDocSnapshot.data().text;

      if (!isBulkDeletion) {
        addToLog("❌ " + userNickname + " poisti listauksen: " + itemText);
      }
      // poistetaan listaus
      await deleteDoc(itemDocRef);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const deleteAll = async () => {
    if (
      window.confirm(
        "❗ Poistettuja listauksia ei voi palauttaa, tyhjennetäänkö lista?"
      )
    ) {
      const itemsCollectionRef = collection(db, "lists", id, "items");
      const itemsSnapshot = await getDocs(itemsCollectionRef);

      // lisätään lokiin tieto tyhjennetystä listasta
      addToLog("❗ " + userNickname + " tyhjensi listan");

      itemsSnapshot.forEach((item) => {
        deleteTodo(item.id, true);
      });
    }
  };

  const deleteListFromAllUsers = async (id) => {
    const usersCollectionRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersCollectionRef);

    usersSnapshot.forEach(async (user) => {
      const userDocRef = doc(db, "users", user.id);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();

        // tarkistetaan, onko käyttäjällä listoja
        if (userData.lists && userData.lists.includes(id)) {
          // poistetaan lista käyttäjän listoista
          const updatedLists = userData.lists.filter((listId) => listId !== id);

          // päivitetään käyttäjän listat
          await updateDoc(userDocRef, { lists: updatedLists });
        }
      }
    });
  };

  const deleteList = async () => {
    const membersArray = [];
    const membersSnapshot = await getDocs(
      query(collection(db, "lists", id, "members"))
    );
    membersSnapshot.forEach((member) => {
      membersArray.push(member.data());
    });

    const nicknameInput = prompt("Syötä käyttäjätunnus jatkaaksesi");
    if (nicknameInput === userNickname) {
      if (
        window.confirm(
          `❗ Listalla on ${membersArray.length} jäsentä. Poistettua listaa ei voi palauttaa, poistetaanko lista?`
        )
      ) {
        const listDocRef = doc(db, "lists", id);
        // poistetaan lista jokaisen jäsenen listoista
        deleteListFromAllUsers(id);
        // poistetaan lista-doc
        await deleteDoc(listDocRef);
        navigate("/");
      }
    } else {
      alert("❌ Käyttäjätunnuksen vahvistaminen epäonnistui");
    }
  };

  // jäsenten näyttäminen

  const [members, setMembers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);
  const [membersMode, setMembersMode] = useState(true);
  const [ownerId, setOwnerId] = useState("");

  const getListOwnerNickname = async () => {
    try {
      const listDocRef = doc(db, "lists", id);
      const listDocSnapshot = await getDoc(listDocRef);

      if (listDocSnapshot.exists()) {
        const listData = listDocSnapshot.data();
        setOwnerId(listData.owner);
      }
    } catch (error) {
      console.error("Error getting list owner:", error);
    }
  };

  const getListLog = async () => {
    try {
      const listDocRef = doc(db, "lists", id);
      const listDocSnapshot = await getDoc(listDocRef);

      if (listDocSnapshot.exists()) {
        const listData = listDocSnapshot.data();
        const log = listData.log || [];

        return log;
      }
    } catch (error) {
      console.error("Error getting list log:", error);
    }
  };

  const fetchMembers = async () => {
    const membersArray = [];
    const membersSnapshot = await getDocs(
      query(collection(db, "lists", id, "members"))
    );
    membersSnapshot.forEach((member) => {
      membersArray.push(member.data());
    });
    setMembers(membersArray);
  };

  useEffect(() => {
    if (showMembers) {
      fetchMembers();
      getListOwnerNickname();
    }
  }, [showMembers, id]);

  const toggleShowMembers = () => {
    setShowMembers(!showMembers);
  };

  const listElementRef = useRef(null);

  const [showInviteToListModal, setShowInviteToListModal] = useState(false);

  const toggleShowInviteToListModal = () => {
    setShowInviteToListModal(!showInviteToListModal);
  };

  useEffect(() => {
    const handleClickOutsideModal = (event) => {
      if (
        listElementRef.current &&
        !listElementRef.current.contains(event.target)
      ) {
        setShowMembers(false);
        setMembersMode(true);
        setShowInviteToListModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideModal);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideModal);
    };
  }, []);

  // listView.jsx:ssä käytettävät funktiot

  const getUserNicknameById = async (userId) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        return userData.nickname;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting user nickname:", error);
      return null;
    }
  };

  const getUserIdByNickname = async (nickname) => {
    try {
      const usersCollectionRef = collection(db, "users");
      const usersQuery = query(
        usersCollectionRef,
        where("nickname", "==", nickname)
      );

      const usersQuerySnapshot = await getDocs(usersQuery);

      if (usersQuerySnapshot.empty) {
        return null;
      } else {
        const userId = usersQuerySnapshot.docs[0].id;
        return userId;
      }
    } catch (error) {
      console.error("Error getting user id:", error);
      return null;
    }
  };

  const leaveList = async (listId, userId) => {
    if (window.confirm("Oletko varma?")) {
      try {
        // päivitetään listan "members" collection
        const listRef = doc(db, "lists", listId);

        const membersCollectionRef = collection(listRef, "members");

        // poistetaan käyttäjän dokumentti members-collectionista
        await deleteDoc(doc(membersCollectionRef, userId));

        // päivitetään käyttäjän "lists" -kenttä
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.lists && userData.lists.includes(listId)) {
            await updateDoc(userRef, {
              lists: arrayRemove(listId),
            });
          }
        }

        alert("Poistuit listalta");
        navigate("/");
      } catch (error) {
        console.error("Error: ", error);
      }
    }
  };

  const removeUser = async (listId, userNickname) => {
    const userId = await getUserIdByNickname(userNickname);

    if (window.confirm("Oletko varma?")) {
      try {
        const listRef = doc(db, "lists", listId);

        const membersCollectionRef = collection(listRef, "members");

        // poistetaan käyttäjän dokumentti members-collectionista
        await deleteDoc(doc(membersCollectionRef, userId));

        // Update the user's "lists" field
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.lists && userData.lists.includes(listId)) {
            await updateDoc(userRef, {
              lists: arrayRemove(listId),
            });
          }
        }

        alert(`❗️ Käyttäjä ${userNickname} poistettu listalta.`);
        toggleShowMembers();
      } catch (error) {
        console.error("Error: ", error);
      }
    }
  };

  useEffect(() => {
    getListOwnerNickname();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        const nickname = await getUserNicknameById(user.uid);
        setUserNickname(nickname);
      } else {
        navigate("/login");
      }
    });

    const unsubscribeUserId = () => {
      exitIfNotMember();
    };

    return () => {
      unsubscribe();
      unsubscribeUserId();
    };
  }, [navigate, id]);

  const getListTheme = async () => {
    try {
      const listDocRef = doc(db, "lists", id);
      const listDocSnapshot = await getDoc(listDocRef);

      if (listDocSnapshot.exists()) {
        const listData = listDocSnapshot.data();
        const theme = {
          bgColor: listData.bgColor,
          textColor: listData.textColor,
          listingColor: listData.listingColor,
          paragraphColor: listData.paragraphColor,
        };
        return theme;
      }
    } catch (error) {
      console.error("Error getting list theme:", error);
    }
  };

  const [headerBg, setHeaderBg] = useState("");
  const [headerStyle, setHeaderStyle] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const theme = await getListTheme();

        // tekstin väri
        localStorage.setItem("textColor", theme.textColor);

        // tausta
        localStorage.setItem("bgColor", theme.bgColor);
        if (theme.bgColor) {
          if (theme.bgColor.includes("gradient")) {
            document.body.style = `background: ${theme.bgColor}`; // Set backgroundImage for gradient colors
            document.body.style.backgroundColor = "transparent";
          } else if (theme.bgColor.includes("https")) {
            document.body.style = `background-image: url(${theme.bgColor}); background-repeat: round;`; // Set backgroundImage for images
            document.body.style.backgroundColor = "transparent";
          } else {
            document.body.style = ""; // Clear backgroundImage for solid colors
            document.body.style.backgroundColor = theme.bgColor;
          }
        }

        // listauksen väri
        localStorage.setItem("listingColor", theme.listingColor);

        // tekstin väri
        localStorage.setItem("paragraphColor", theme.paragraphColor);
        document.body.style.color = theme.paragraphColor;
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 40;
      setIsScrolled(scrolled);
      const bodyStyle = window.getComputedStyle(document.body); // Get computed styles of the body
      const copiedStyles = {
        backgroundColor: bodyStyle.backgroundColor,
        backgroundImage: bodyStyle.backgroundImage,
        background: bodyStyle.background, // Add other styles you want to copy from the body to the header
        // Add other styles you want to copy from the body to the header
        backdropFilter: "blur(10px)",
      };
      // Remove background repeat from the backgroundImage property if present
      copiedStyles.background = copiedStyles.background
        .replace(/round/g, "")
        .trim();

      setHeaderStyle(copiedStyles);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [themeModalOpen, setThemeModalOpen] = useState(false);

  const updateHeaderBackground = () => {
    const bodyStyle = window.getComputedStyle(document.body);
    const headerStyle = {
      backgroundColor: bodyStyle.backgroundColor,
      backgroundImage: bodyStyle.backgroundImage,
      background: bodyStyle.background,
    };

    headerStyle.background = headerStyle.background
      .replace(/round/g, "")
      .trim();

    setHeaderStyle(headerStyle);
  };

  const toggleThemeModal = () => {
    setThemeModalOpen(!themeModalOpen);
    updateHeaderBackground();
  };

  return (
    <div
      style={{ color: localStorage.getItem("paragraphColor") }}
      className={`${listStyle.container}`}
      ref={listElementRef}
    >
      <div
        id="header"
        className={`flex justify-between items-center bg-transparent sticky top-0 z-30`}
        style={
          localStorage.getItem("bgColor").includes("gradient") ||
          localStorage.getItem("bgColor").includes("https")
            ? isScrolled
              ? {
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  zIndex: "30",
                  backgroundColor: "transparent",
                }
              : {
                  backgroundColor: "transparent",
                }
            : {
                backgroundColor: `${localStorage.getItem("bgColor")}`,
              }
        }
      >
        <h1
          style={{ color: `${localStorage.getItem("textColor")}` }}
          className={`${listStyle.heading}`}
        >
          <p className={listStyle.plus}>{listInfo.icon}</p>
          {listInfo.name}
        </h1>
        <div className={listStyle.buttons}>
          <button onClick={toggleShowMembers} className="">
            <p className={listStyle.plus}>👥</p>
          </button>
          <button onClick={toggleShowInviteToListModal}>
            <p className={listStyle.plus}>🔗</p>
          </button>
        </div>
      </div>
      <form onSubmit={createTodo} className={listStyle.form}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={listStyle.input}
          spellCheck="false"
          type="text"
          placeholder="lisää listaus"
        ></input>
        <button className={listStyle.button}>
          <p className={listStyle.plus}>➕</p>
        </button>
      </form>
      <ul>
        {/* Tulosta tekemättömät ylimmäksi */}
        {items
          .filter((todo) => !todo.completed)
          .map((todo) => (
            <Todo
              key={todo.id}
              todo={todo}
              toggleComplete={() => toggleComplete(todo.id)}
              editTodo={editTodo}
              deleteTodo={() => deleteTodo(todo.id)}
            />
          ))}
        {/* Tulosta tehdyt alimmaksi */}
        {items
          .filter((todo) => todo.completed)
          .map((todo) => (
            <Todo
              key={todo.id}
              todo={todo}
              toggleComplete={() => toggleComplete(todo.id)}
              editTodo={editTodo}
              deleteTodo={() => deleteTodo(todo.id)}
            />
          ))}
      </ul>

      <div className={listStyle.bottom}>
        {items.length < 1 ? null : (
          <>
            <p
              style={{
                backgroundColor: localStorage
                  .getItem("bgColor")
                  .includes("https")
                  ? localStorage.getItem("listingColor")
                  : "transparent",
                backdropFilter: localStorage
                  .getItem("bgColor")
                  .includes("https")
                  ? "blur(10px)"
                  : "none",
                WebkitBackdropFilter: localStorage
                  .getItem("bgColor")
                  .includes("https")
                  ? "blur(10px)"
                  : "none",

                zIndex: "30",
              }}
              className={listStyle.count}
            >
              {items.length > 1
                ? `${items.length} listausta`
                : `${items.length} listaus`}
            </p>
            <button className={listStyle.deleteAllButton} onClick={deleteAll}>
              <p className={listStyle.plus}>❌ </p> tyhjennä lista
            </button>
            <button
              onClick={toggleThemeModal}
              className={`${listStyle.gear} mt-4`}
            >
              🎨
            </button>
          </>
        )}
        <div className="grid grid-cols-2 absolute bottom-9">
          {ownerId === userId && items.length === 0 && (
            <>
              <button onClick={deleteList} className="">
                <p className={listStyle.deleteListIcon}>🗑️</p>
                <span className={listStyle.link}> poista lista</span>
              </button>
              <button onClick={toggleThemeModal} className={listStyle.gear}>
                🎨
              </button>
            </>
          )}
        </div>
      </div>
      {showMembers && (
        <MembersModal
          members={members}
          ownerId={ownerId}
          toggleShowMembers={toggleShowMembers}
          showMembers={showMembers}
          membersMode={membersMode}
          setMembersMode={setMembersMode}
          getListLog={getListLog}
          listId={id}
          userId={userId}
          leaveList={leaveList}
          removeUser={removeUser}
        />
      )}
      {showInviteToListModal && (
        <InviteToListModal
          ownerId={ownerId}
          listInfo={listInfo}
          toggleShowMembers={toggleShowMembers}
          showMembers={showMembers}
          getUserNicknameById={getUserNicknameById}
          getUserIdByNickname={getUserIdByNickname}
          toggleShowInviteToListModal={toggleShowInviteToListModal}
        />
      )}
      {themeModalOpen && (
        <ThemeModalList toggleColorModal={toggleThemeModal} id={id} />
      )}
    </div>
  );
};
