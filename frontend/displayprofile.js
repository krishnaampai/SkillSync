import { auth, db } from "../backend/env.js";
import { doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

export async function updateProfileDisplay() {
    const userId = localStorage.getItem("LoggedInUserId");
    if (!userId) {
        console.log("User is not logged in.");
        return;
    }

    try {
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            document.getElementById("name").textContent = userData.name || "No name available";
            document.getElementById("githublink").href = userData.github || "#";  
            document.getElementById("githublink").textContent = userData.github || "GitHub Profile"; 

            const skillsList = document.getElementById("skills-list");
            skillsList.innerHTML = "";
            (userData.skills || []).forEach(skill => {
                const skillElement = document.createElement("div");
                skillElement.classList.add("skill");
                skillElement.textContent = skill;
                skillsList.appendChild(skillElement);
            });

            displayProjects();
        } else {
            console.log("No such user document!");
        }
    } catch (error) {
        console.error("Error getting user document:", error);
    }
}

async function displayProjects() {
    try {
        const projectsList = document.getElementById("projects-list");
        projectsList.innerHTML = "";

        const projectsCollection = collection(db, "Project");
        const projectsSnapshot = await getDocs(projectsCollection);

        projectsSnapshot.forEach(doc => {
            const projectData = doc.data();

            const projectCard = document.createElement("div");
            projectCard.classList.add("project-card");
            projectCard.innerHTML = `
    <h3>${projectData.name}</h3>
    <p>${projectData.description.slice(0, 50)}...</p>
    <button class="view-details-btn">View Details</button>
`;
projectCard.querySelector(".view-details-btn").onclick = () => showProjectDetails(projectData);

projectsList.appendChild(projectCard);

        });
    } catch (error) {
        console.error("Error fetching projects:", error);
    }
}

function showProjectDetails(project) {
    const projectDetailsDiv = document.getElementById("project-details");
    
    projectDetailsDiv.innerHTML = `
        <h3>${project.name}</h3>
        <p><strong>Description:</strong> ${project.description}</p>
        <p><strong>Required Skills:</strong> ${project.skills.join(", ")}</p>
        <button class="request-collab-btn" onclick="viewCollaborationRequests('${project.id}')">
            View Collaboration Requests
        </button>
        <div id="collab-requests-list"></div> 
    `;
}



updateProfileDisplay();
