import { useState } from "react";
import "./adduser.css";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../../lib/firebase"; // Ensure Firebase config is imported correctly
import { useUserStore } from "../../../lib/userStore";

const AddUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useUserStore();

  // Handle search for a username
  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username").trim().toLowerCase(); // Normalize input

    if (!username) {
      alert("Please enter a username.");
      return;
    }

    setLoading(true);

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username_lower", "==", username)); // Query normalized field
      const querySnapShot = await getDocs(q);

      if (!querySnapShot.empty) {
        const foundUser = querySnapShot.docs[0];
        setUser({ id: foundUser.id, ...foundUser.data() });
      } else {
        setUser(null);
        alert("User not found.");
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      alert("An error occurred while searching for the user.");
    } finally {
      setLoading(false);
    }
  };

  // Handle adding the user to the chat
  const handleAdd = async () => {
    if (!user || !currentUser) return;

    const userChatsRef = doc(db, "userChats", currentUser.id);
    const receiverChatsRef = doc(db, "userChats", user.id);

    try {
      // Prevent duplicate chats
      const currentUserChats = currentUser.chats || [];
      const existingChat = currentUserChats.find(
        (chat) => chat.receiverId === user.id
      );

      if (existingChat) {
        alert("Chat already exists!");
        return;
      }

      // Create a new chat document
      const newChatRef = doc(collection(db, "chats"));
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      // Update the current user's chats
      await updateDoc(userChatsRef, {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: serverTimestamp(),
        }),
      });

      // Update the receiver's chats
      await updateDoc(receiverChatsRef, {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: serverTimestamp(),
        }),
      });

      console.log("Chat added with ID:", newChatRef.id);
      alert("Chat started successfully!");
    } catch (err) {
      console.error("Error adding chat:", err);
      alert("An error occurred while adding the chat.");
    }
  };

  return (
    <div className="adduser">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Enter Username" name="username" />
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      {user && (
        <div className="user">
          <div className="detail">
            <img src={user.avatar || "./avatar.png"} alt="User Avatar" />
            <span>{user.username}</span>
          </div>
          <button onClick={handleAdd}>Add User</button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
