import { auth, db } from "../../lib/firebase";
import "./detail.css";
import { useUserStore } from "../../lib/userStore";
import { useChatStore } from "../../lib/chatStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

const Detail = () => {
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } =
    useChatStore();

  const { currentUser } = useUserStore();

  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="detail">
      <div className="user">
        <img src={user?.avatar || "./avatar.png"} />
        <h2>{user?.username}</h2>
        <p> Lorem ipsum dolor sit amet consectetur, </p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src="./arrowUp.png" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy & Help</span>
            <img src="./arrowUp.png" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Photos</span>
            <img src="./arrowDown.png" />
          </div>
          <div className="photos">
            <div className="photoItem">
              <div className="photoDdetail">
                <img src="https://images.pexels.com/photos/18869569/pexels-photo-18869569/free-photo-of-close-up-of-porcelain-tableware.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load" />
                <span>photo_2024_2.png</span>
              </div>

              <img src="./download.png" className="icon" />
            </div>
            <div className="photoItem">
              <div className="photoDdetail">
                <img src="https://images.pexels.com/photos/18869569/pexels-photo-18869569/free-photo-of-close-up-of-porcelain-tableware.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load" />
                <span>photo_2024_2.png</span>
              </div>

              <img src="./download.png" className="icon" />
            </div>
            <div className="photoItem">
              <div className="photoDdetail">
                <img src="https://images.pexels.com/photos/18869569/pexels-photo-18869569/free-photo-of-close-up-of-porcelain-tableware.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load" />
                <span>photo_2024_2.png</span>
              </div>

              <img src="./download.png" className="icon" />
            </div>
            <div className="photoItem">
              <div className="photoDdetail">
                <img src="https://images.pexels.com/photos/18869569/pexels-photo-18869569/free-photo-of-close-up-of-porcelain-tableware.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load" />
                <span>photo_2024_2.png</span>
              </div>

              <img src="./download.png" className="icon" />
            </div>
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src="./arrowUp.png" />
          </div>
        </div>
        <button onClick={handleBlock}>
          {isCurrentUserBlocked
            ? "You are Blocked"
            : isReceiverBlocked
            ? "User Blocked"
            : "Block User"}
        </button>
        <button className="logout" onClick={() => auth.signOut()}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Detail;
