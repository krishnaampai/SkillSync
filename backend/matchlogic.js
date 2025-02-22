import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, setDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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


let users = []; // Stores all users from Firestore

// Fetch all users and unique skills from Firestore
async function fetchUsersAndSkills() {
  try {
    const usersRef = collection(db, "users");
    const querySnapshot = await getDocs(usersRef);
    
    // Store all users with their IDs
    users = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Extract unique skills
    const skillsSet = new Set();
    querySnapshot.forEach(doc => {
      const skills = doc.data().skills || [];
      skills.forEach(skill => skillsSet.add(skill));
    });
    
    return Array.from(skillsSet).sort();
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

// Find users by selected skill
function findUsersBySkill(selectedSkill) {
  return users.filter(user => 
    user.skills && user.skills.includes(selectedSkill)
  );
}

// Display users in horizontal scroll
function displayUsers(matchingUsers) {
  const container = document.getElementById("result");
  container.innerHTML = "";

  if (matchingUsers.length === 0) {
    container.textContent = "No matching users found.";
    return;
  }

  const scrollWrapper = document.createElement("div");
  scrollWrapper.className = "user-scroll-wrapper";

  matchingUsers.forEach(user => {
    const userCard = document.createElement("div");
    userCard.className = "user-card";
    userCard.innerHTML = `
      <strong>${user.name}</strong><br>
      ${user.bio ? `Bio: ${user.bio}<br>` : ''}
      ${user.experienceLevel ? `Experience: ${user.experienceLevel}<br>` : ''}
      ${user.availability ? `Available: ${user.availability}<br>` : ''}
      <span class="details-link">Click for details</span>
    `;
    userCard.addEventListener("click", () => displayUserDetails(user));
    scrollWrapper.appendChild(userCard);
  });

  container.appendChild(scrollWrapper);
}

// Show detailed user modal
function displayUserDetails(user) {
  const detailsContainer = document.getElementById("userDetails");
  detailsContainer.innerHTML = `
    <div class="user-details-card">
      <h3>${user.name}</h3>
      ${user.email ? `<p>Email: <a href="mailto:${user.email}">${user.email}</a></p>` : ''}
      ${user.github ? `<p>GitHub: <a href="${user.github}" target="_blank">${user.github}</a></p>` : ''}
      ${user.bio ? `<p>Bio: ${user.bio}</p>` : ''}
      ${user.experienceLevel ? `<p>Experience: ${user.experienceLevel}</p>` : ''}
      ${user.availability ? `<p>Availability: ${user.availability}</p>` : ''}
      ${user.skills ? `<p>Skills: ${user.skills.join(", ")}</p>` : ''}
      ${user.interests ? `<p>Interests: ${user.interests.join(", ")}</p>` : ''}
    </div>
  `;
}

// Initialize app when DOM loads
document.addEventListener("DOMContentLoaded", async () => {
  // Create container elements
  const container = document.createElement("div");
  container.className = "container";
  
  const dropdownContainer = document.createElement("div");
  dropdownContainer.className = "dropdown-container";
  
  const dropdown = document.createElement("select");
  dropdown.id = "skillDropdown";
  
  // Add loading state
  dropdown.innerHTML = `
    <option value="" disabled selected>Loading skills...</option>
  `;
  
  // Create results containers
  const resultDiv = document.createElement("div");
  resultDiv.id = "result";
  const detailsDiv = document.createElement("div");
  detailsDiv.id = "userDetails";

  // Assemble DOM
  dropdownContainer.appendChild(dropdown);
  container.appendChild(dropdownContainer);
  container.appendChild(resultDiv);
  container.appendChild(detailsDiv);
  document.body.appendChild(container);

  try {
    // Fetch data from Firestore
    const availableSkills = await fetchUsersAndSkills();
    
    // Populate dropdown
    dropdown.innerHTML = `
      <option value="" disabled selected>Select a skill</option>
      ${availableSkills.map(skill => `
        <option value="${skill}">${skill}</option>
      `).join('')}
    `;
    
    // Add event listener for skill selection
    dropdown.addEventListener("change", (event) => {
      const selectedSkill = event.target.value;
      const matchingUsers = findUsersBySkill(selectedSkill);
      displayUsers(matchingUsers);
    });
  } catch (error) {
    console.error("Initialization error:", error);
    dropdown.innerHTML = `
      <option value="" disabled selected>Error loading skills</option>
    `;
  }
});

// Add basic CSS styles
const style = document.createElement("style");
style.textContent = `
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .dropdown-container {
    margin-bottom: 30px;
    text-align: center;
  }

  #skillDropdown {
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 25px;
    border: 2px solid #007bff;
    background: white;
    cursor: pointer;
  }

  .user-scroll-wrapper {
    display: flex;
    overflow-x: auto;
    gap: 20px;
    padding: 20px 40px;
    scroll-behavior: smooth;
  }

  .user-card {
    border: 2px solid #007bff;
    border-radius: 15px;
    padding: 20px;
    min-width: 300px;
    background: #f0f8ff;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    cursor: pointer;
    transition: transform 0.2s;
  }

  .user-card:hover {
    transform: scale(1.03);
  }

  .details-link {
    color: #007bff;
    text-decoration: underline;
  }

  .user-details-card {
    border: 2px solid #333;
    border-radius: 10px;
    padding: 20px;
    background: white;
    margin-top: 20px;
  }
`;
document.head.appendChild(style);