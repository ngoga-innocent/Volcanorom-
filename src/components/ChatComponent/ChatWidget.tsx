import { SendHorizonal } from "lucide-react";
import { useState, useEffect } from "react";
import { FaComments, FaTimes } from "react-icons/fa";

import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  increment,
} from "firebase/firestore";

import { ref, set, onValue } from "firebase/database";
import { db, rtdb } from "../../app/firebase";

const ClientChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [started, setStarted] = useState(false);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  const [online, setOnline] = useState(false);
  const [typing, setTyping] = useState(false);

  const storedRoom = localStorage.getItem("chat_uid");
  const userId = storedRoom || crypto.randomUUID();

  if (!storedRoom) {
    localStorage.setItem("chat_uid", userId);
  }

  const roomRef = doc(db, "chatRooms", userId);

  // Start Chat
  const startChat = async () => {
    const room = await getDoc(roomRef);

    if (!room.exists()) {
      await setDoc(roomRef, {
        userId,
        userName: name,
        createdAt: serverTimestamp(),
        lastMessageTime: serverTimestamp(),
        userOnline: true,
        userTyping: false,
      });
    }

    setStarted(true);
  };

  // Listen to messages
  useEffect(() => {
    if (!started) return;

    const q = query(
      collection(db, "chatRooms", userId, "messages"),
      orderBy("timestamp")
    );

    const unsub = onSnapshot(q, (snap) => {
      const arr: any[] = [];

      snap.forEach((d) => arr.push({ id: d.id, ...d.data() }));

      setMessages(arr);
    });

    return () => unsub();
  }, [started]);

  // User presence
  useEffect(() => {
    if (!started) return;

    const statusRef = ref(rtdb, "status/" + userId);

    set(statusRef, {
      online: true,
      typing: false,
      lastSeen: Date.now(),
    });
  }, [started]);

  // Admin online listener
  useEffect(() => {
    const adminRef = ref(rtdb, "status/admin");

    onValue(adminRef, (snap) => {
      if (snap.exists()) {
        setOnline(snap.val().online);
      }
    });
  }, []);

  // Send message
  const sendMessage = async () => {
    if (!message.trim()) return;

    await addDoc(collection(db, "chatRooms", userId, "messages"), {
      sender: "user",
      text: message,
      timestamp: serverTimestamp(),
      status: "sent",
    });

    await updateDoc(roomRef, {
      lastMessage: message,
      lastMessageTime: serverTimestamp(),
      unreadAdmin: increment(1),
    });

    setMessage("");
    setTyping(false);
  };

  // Typing
  const handleTyping = (e: any) => {
    setMessage(e.target.value);

    const statusRef = ref(rtdb, "status/" + userId);

    set(statusRef, {
      online: true,
      typing: true,
      lastSeen: Date.now(),
    });
  };

  // Disconnect
  const handleDisconnect = () => {
    const statusRef = ref(rtdb, "status/" + userId);

    set(statusRef, {
      online: false,
      typing: false,
      lastSeen: Date.now(),
    });
  };

  // Toggle chat
  const handleOpenClose = () => {
    if (open) {
      handleDisconnect();
      setOpen(false);
      setStarted(false);
    } else {
      setOpen(true);
      if (storedRoom) setStarted(true);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={handleOpenClose}
        className={`fixed bottom-11 right-6 sm:bottom-16 z-100 p-4  rounded-full shadow-lg text-white transition ${
          open ? "bg-violet-500" : "bg-blue-600"
        }`}
      >
        {open ? <FaTimes /> : <FaComments />}
      </button>

      {/* Chat Window */}
      {open && (
        <div
          className="
          fixed
          bottom-16 right-0
          w-full h-[85vh]
          sm:bottom-24 sm:right-6 sm:w-95 sm:h-[70vh]
          bg-white
          rounded-t-xl sm:rounded-xl
          shadow-2xl
          flex flex-col
          z-50
        "
        >
          {/* Header */}
          <div className="bg-blue-600 text-white p-3 rounded-t-xl flex justify-between items-center">
            <span className="font-semibold">Support Chat</span>

            <span className="text-xs">
              {online ? "🟢 Online" : "⚫ Offline"}
            </span>
          </div>

          {/* Start Chat Screen */}
          {!started && !storedRoom && (
            <div className="flex flex-col items-center justify-center flex-1 gap-4 p-6 text-black">
              <p className="text-gray-700 text-center">
                Start conversation with support
              </p>

              <input
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-300 p-2 rounded w-full"
              />

              <button
                onClick={startChat}
                className="bg-blue-600 text-white px-4 py-2 rounded w-full"
              >
                Start Chat
              </button>
            </div>
          )}

          {/* Messages */}
          {started && (
            <>
              <div className="flex-1 p-3 overflow-y-auto text-black text-sm sm:text-base">
                {messages.map((m: any) => (
                  <div
                    key={m.id}
                    className={`mb-2 ${
                      m.sender === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    <span
                      className={`inline-block px-3 py-2 rounded-lg ${
                        m.sender === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {m.text}
                    </span>
                  </div>
                ))}

                {typing && (
                  <p className="text-xs text-gray-400">Admin typing...</p>
                )}
              </div>

              {/* Input */}
              <div className="flex items-center gap-2 p-2 border-t">
                <input
                  value={message}
                  onChange={handleTyping}
                  className="flex-1 px-3 py-2 outline-none border border-gray-300 text-black rounded-full text-sm"
                  placeholder="Type message..."
                />

                <button
                  onClick={sendMessage}
                  className="px-3 py-2 bg-blue-600 text-white rounded-full"
                >
                  <SendHorizonal size={18} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ClientChatWidget;