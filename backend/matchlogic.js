import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, setDoc, getDoc, onSnapshot, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBSCJwX9e92JFyRWlOkMxCfyJfE15oSgJU",
  authDomain: "skillsync-67adc.firebaseapp.com",
  projectId: "skillsync-67adc",
  storageBucket: "skillsync-67adc.firebasestorage.app",
  messagingSenderId: "646697456816",
  appId: "1:646697456816:web:c09c78851964844a085775",
  measurementId: "G-H7TNCMZPJ0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let users = [];
let currentIndex = 0;
let currentUserId = null;
let currentChatId = null;
let unsubscribeMessages = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUserId = user.uid;
    if (users.length > 0) displayUser();
  }
});

async function searchUsers() {
  const skill = document.getElementById("skill-input").value.toLowerCase();
  const expLevel = document.getElementById("experience-filter").value;
  if (!skill) return alert("Enter a skill!");

  try {
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);
    users = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(user => 
        user.id !== currentUserId && 
        user.skills?.some(s => s.toLowerCase() === skill) &&
        (expLevel === "any" || user.experienceLevel === expLevel)
      );

    if (users.length === 0) {
      alert("No users found!");
      return;
    }

    currentIndex = 0;
    displayUser();
  } catch (error) {
    console.error("Error searching users:", error);
    alert("Failed to fetch users");
  }
}

function displayUser() {
  if (!users.length) return;

  const user = users[currentIndex];
  document.getElementById("profile-name").textContent = user.name;
  document.getElementById("profile-exp").textContent = user.experienceLevel;
  document.getElementById("profile-github").href = user.github;
  document.getElementById("profile-github").textContent = user.github;
  document.getElementById("chat-user-name").textContent = user.name;

  const skillsContainer = document.getElementById("profile-skills");
  skillsContainer.innerHTML = "";
  user.skills.forEach(skill => {
    const skillElement = document.createElement("span");
    skillElement.className = "skill";
    skillElement.textContent = skill;
    skillsContainer.appendChild(skillElement);
  });

  const profileCard = document.getElementById("user-profile");
  profileCard.style.display = "block";
  setTimeout(() => profileCard.classList.add("show"), 10);
  document.getElementById("chat-container").style.display = "block";
  openChat(user.id);
}

async function openChat(matchedUserId) {
  if (!currentUserId) return;

  const chatId = [currentUserId, matchedUserId].sort().join("_");
  currentChatId = chatId;

  document.getElementById("chat-box").innerHTML = "";

  const chatRef = doc(db, "chats", chatId);
  const chatSnap = await getDoc(chatRef);

  if (!chatSnap.exists()) {
    await setDoc(chatRef, { messages: [] });
  }

  listenForMessages(chatRef);
}

function listenForMessages(chatRef) {
  if (unsubscribeMessages) unsubscribeMessages();

  unsubscribeMessages = onSnapshot(chatRef, (snapshot) => {
    if (!snapshot.exists()) return;
    const messages = snapshot.data().messages;
    displayMessages(messages);
    
    setTimeout(() => {
      const chatBox = document.getElementById("chat-box");
      chatBox.scrollTop = chatBox.scrollHeight;
    }, 100);
  });
}

function displayMessages(messages) {
  const chatBox = document.getElementById("chat-box");
  chatBox.innerHTML = "";
  messages.forEach(msg => {
    const msgElement = document.createElement("div");
    msgElement.className = msg.sender === currentUserId ? "message sent" : "message received";
    msgElement.textContent = msg.text;
    chatBox.appendChild(msgElement);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  if (!currentChatId) return;

  const messageInput = document.getElementById("message-input");
  const messageText = messageInput.value.trim();
  if (!messageText) return;

  try {
    const chatRef = doc(db, "chats", currentChatId);
    await updateDoc(chatRef, {
      messages: arrayUnion({ 
        sender: currentUserId, 
        text: messageText, 
        timestamp: Date.now() 
      })
    });
    messageInput.value = "";
  } catch (error) {
    console.error("Error sending message:", error);
    alert("Failed to send message");
  }
}

window.searchUsers = searchUsers;
window.nextUser = () => { currentIndex = (currentIndex + 1) % users.length; displayUser(); };
window.prevUser = () => { currentIndex = (currentIndex - 1 + users.length) % users.length; displayUser(); };
window.sendCollabRequest = () => alert(`Collab request sent to ${users[currentIndex].name}!`);
window.sendMessage = sendMessage;