// Import the necessary Firebase libraries
import { auth, db } from "../backend/env.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

export async function updateProfileDisplay() {
    // Get the logged-in user's ID
    const userId = localStorage.getItem("LoggedInUserId");
    if (!userId) {
        console.log("User is not logged in.");
        return;
    }

    try {
        // Reference to the user's document in Firestore
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            // Get user data from Firestore
            const userData = userDoc.data();
            const name = userData.name || "No name available";
            const githubLink = userData.github || "#";  
            const skills = userData.skills || [];
            const projects = userData.projects || []; 
            document.getElementById("name").textContent = name;
            document.getElementById("githublink").href = githubLink;
            document.getElementById("githublink").textContent = githubLink; 

            
            const skillsList = document.getElementById("skills-list");
            skillsList.innerHTML = ""; 
            skills.forEach(skill => {
                const skillElement = document.createElement("div");
                skillElement.classList.add("skill");
                skillElement.textContent = skill;
                skillsList.appendChild(skillElement);
            });

            // Display projects
            const projectsList = document.getElementById("projects-list");
            projectsList.innerHTML = ""; 
            projects.forEach(project => {
                const projectElement = document.createElement("div");
                projectElement.textContent = project;
                projectsList.appendChild(projectElement);
            });
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.error("Error getting document:", error);
    }
}


updateProfileDisplay();
