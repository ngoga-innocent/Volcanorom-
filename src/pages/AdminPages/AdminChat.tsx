import { SendHorizonal, ArrowLeft, Trash2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";

import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  addDoc,
  serverTimestamp,
  updateDoc,
  getDocs,
  deleteDoc
} from "firebase/firestore";

import { ref, set, onValue } from "firebase/database";

import { db, rtdb } from "../../app/firebase";

const AdminChatsPage = () => {

  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [userOnline, setUserOnline] = useState(false);
  const [userTyping, setUserTyping] = useState(false);

  const bottomRef = useRef<any>(null);

  /*
  =====================
  ADMIN PRESENCE
  =====================
  */

  useEffect(() => {

    const adminRef = ref(rtdb, "status/admin");

    set(adminRef, {
      online: true,
      typing: false
    });

  }, []);

  /*
  =====================
  LOAD CHAT ROOMS
  =====================
  */

  useEffect(() => {

    setLoading(true);

    const q = query(
      collection(db, "chatRooms"),
      orderBy("lastMessageTime", "desc")
    );

    const unsub = onSnapshot(q, snap => {

      const arr:any = [];

      snap.forEach(doc => {
        arr.push({ id: doc.id, ...doc.data() });
      });

      setRooms(arr);
      setLoading(false);

    });

    return () => unsub();

  }, []);

  /*
  =====================
  LOAD MESSAGES
  =====================
  */

  useEffect(() => {

    if (!selectedUser) return;

    const q = query(
      collection(db, "chatRooms", selectedUser.id, "messages"),
      orderBy("timestamp")
    );

    const unsub = onSnapshot(q, snap => {

      const arr:any = [];

      snap.forEach(doc => {

        const data = doc.data();

        arr.push({ id: doc.id, ...data });

        if (data.sender === "user" && data.status !== "seen") {
          updateDoc(doc.ref, { status: "seen" });
        }

      });

      setMessages(arr);

    });

    return () => unsub();

  }, [selectedUser]);

  /*
  =====================
  AUTO SCROLL
  =====================
  */

  useEffect(() => {

    bottomRef.current?.scrollIntoView({
      behavior: "smooth"
    });

  }, [messages]);

  /*
  =====================
  USER PRESENCE
  =====================
  */

  useEffect(() => {

    if (!selectedUser) return;

    const statusRef = ref(rtdb, "status/" + selectedUser.id);

    const unsub = onValue(statusRef, snap => {

      if (snap.exists()) {

        const data = snap.val();

        setUserOnline(data.online);
        setUserTyping(data.typing);

      }

    });

    return () => unsub();

  }, [selectedUser]);

  /*
  =====================
  SEND MESSAGE
  =====================
  */

  const sendMessage = async () => {

    if (!message.trim()) return;

    await addDoc(
      collection(db, "chatRooms", selectedUser.id, "messages"),
      {
        sender: "admin",
        text: message,
        timestamp: serverTimestamp(),
        status: "sent"
      }
    );

    await updateDoc(
      doc(db, "chatRooms", selectedUser.id),
      {
        lastMessage: message,
        lastMessageTime: serverTimestamp()
      }
    );

    setMessage("");

  };

  /*
  =====================
  DELETE CHAT
  =====================
  */

  const deleteChat = async () => {

    if (!selectedUser) return;

    const confirmDelete = confirm(
      "Delete this chat permanently?"
    );

    if (!confirmDelete) return;

    try {

      const messagesRef = collection(
        db,
        "chatRooms",
        selectedUser.id,
        "messages"
      );

      const snap = await getDocs(messagesRef);

      for (const m of snap.docs) {
        await deleteDoc(m.ref);
      }

      await deleteDoc(
        doc(db, "chatRooms", selectedUser.id)
      );

      setSelectedUser(null);

    } catch (err) {

      console.error(err);
      alert("Failed to delete chat");

    }

  };

  /*
  =====================
  FORMAT TIME
  =====================
  */

  const formatTime = (ts:any) => {

    if (!ts) return "";

    const date = ts.toDate();

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

  };

  return (

    <div className="h-[85vh] flex bg-gray-100 text-black rounded-xl overflow-hidden">

      {/* CHAT LIST */}

      <div
        className={`bg-white w-full md:w-1/3 lg:w-1/4 border-r overflow-y-auto
        ${selectedUser ? "hidden md:block" : ""}`}
      >

        <div className="p-4 text-lg font-semibold border-b">
          Conversations
        </div>

        {loading && (
          <p className="p-4 text-gray-500 text-sm">
            Loading chats...
          </p>
        )}

        {rooms.length === 0 && !loading && (
          <p className="p-4 text-gray-500 text-sm">
            No chats yet
          </p>
        )}

        {rooms.map((room:any) => (

          <div
            key={room.id}
            onClick={() => setSelectedUser(room)}
            className="flex items-center gap-3 p-4 border-b cursor-pointer hover:bg-gray-50"
          >

            {/* Avatar */}

            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
              {room.userName?.charAt(0)}
            </div>

            <div className="flex-1">

              <div className="flex justify-between">

                <span className="font-medium text-sm">
                  {room.userName}
                </span>

                {room.unreadAdmin > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 rounded-full">
                    {room.unreadAdmin}
                  </span>
                )}

              </div>

              <p className="text-xs text-gray-500 truncate">
                {room.lastMessage}
              </p>

            </div>

          </div>

        ))}

      </div>

      {/* CHAT AREA */}

      <div
        className={`flex flex-col flex-1 bg-gray-50
        ${!selectedUser ? "hidden md:flex" : ""}`}
      >

        {selectedUser && (

          <>
            {/* HEADER */}

            <div className="flex items-center justify-between p-4 bg-white border-b">

              <div className="flex items-center gap-3">

                <button
                  className="md:hidden"
                  onClick={() => setSelectedUser(null)}
                >
                  <ArrowLeft />
                </button>

                <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center">
                  {selectedUser.userName?.charAt(0)}
                </div>

                <div>

                  <p className="font-semibold text-sm">
                    {selectedUser.userName}
                  </p>

                  <p className="text-xs text-gray-500">
                    {userOnline ? "Online" : "Offline"}
                  </p>

                </div>

              </div>

              <button
                onClick={deleteChat}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>

            </div>

            {/* MESSAGES */}

            <div className="flex-1 overflow-y-auto p-4 space-y-3">

              {messages.map((m:any) => (

                <div
                  key={m.id}
                  className={`flex ${
                    m.sender === "admin"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  <div
                    className={`px-4 py-2 rounded-xl max-w-[75%] text-sm shadow
                    ${
                      m.sender === "admin"
                        ? "bg-blue-600 text-white"
                        : "bg-white"
                    }`}
                  >

                    {m.text}

                    <div className="text-[10px] opacity-60 mt-1 text-right">
                      {formatTime(m.timestamp)}
                    </div>

                  </div>

                </div>

              ))}

              {userTyping && (
                <p className="text-xs text-gray-400">
                  user typing...
                </p>
              )}

              <div ref={bottomRef} />

            </div>

            {/* INPUT */}

            <div className="p-3 bg-white border-t flex gap-2">

              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type message..."
                className="flex-1 border rounded-full px-4 py-2 outline-none"
              />

              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white p-2 rounded-full"
              >
                <SendHorizonal size={18} />
              </button>

            </div>

          </>
        )}

      </div>

    </div>

  );

};

export default AdminChatsPage;