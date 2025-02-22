import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBSCJwX9e92JFyRWlOkMxCfyJfE15oSgJU",
  authDomain: "skillsync-67adc.firebaseapp.com",
  projectId: "skillsync-67adc",
  storageBucket: "skillsync-67adc.firebasestorage.app",
  messagingSenderId: "646697456816",
  appId: "1:646697456816:web:c09c78851964844a085775",
  measurementId: "G-H7TNCMZPJ0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let users = [];
let currentIndex = 0;
let currentUserId = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUserId = user.uid; // Get logged-in user ID
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
        user.id !== currentUserId && // Exclude self profile
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

  const skillsContainer = document.getElementById("profile-skills");
  skillsContainer.innerHTML = "";
  user.skills.forEach(skill => {
    const skillElement = document.createElement("span");
    skillElement.className = "skill";
    skillElement.textContent = skill;
    skillsContainer.appendChild(skillElement);
  });

  const card = document.getElementById("user-profile");
  card.style.display = "block";
  setTimeout(() => card.classList.add("show"), 10);
}

function nextUser() {
  currentIndex = (currentIndex + 1) % users.length;
  displayUser();
}

function prevUser() {
  currentIndex = (currentIndex - 1 + users.length) % users.length;
  displayUser();
}

function sendCollabRequest() {
  alert(`Collab request sent to ${users[currentIndex].name}!`);
}

// Expose functions to global scope for inline event handlers
window.searchUsers = searchUsers;
window.nextUser = nextUser;
window.prevUser = prevUser;
window.sendCollabRequest = sendCollabRequest;