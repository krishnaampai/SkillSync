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

            const projectButton = document.createElement("button");
            projectButton.textContent = projectData.name;
            projectButton.classList.add("project-button");
            projectButton.onclick = () => showProjectDetails(projectData);

            projectsList.appendChild(projectButton);

        });
    } catch (error) {
        console.error("Error fetching projects:", error);
    }
}

async function viewCollaborationRequests(projectId) {
    const collabRequestsDiv = document.getElementById("collab-requests-list");
    collabRequestsDiv.innerHTML = "Loading requests...";

    try {
        const projectRef = doc(db, "Project", projectId);
        const projectSnap = await getDoc(projectRef);

        if (!projectSnap.exists()) {
            collabRequestsDiv.innerHTML = "<p>Project not found.</p>";
            return;
        }

        const project = projectSnap.data();
        let collabRequestsHTML = "<p><strong>Collaboration Requests:</strong></p>";

        if (project.collabRequests && project.collabRequests.length > 0) {
            for (const request of project.collabRequests) {
                const senderRef = doc(db, "users", request.senderId);
                const senderSnap = await getDoc(senderRef);

                let senderName = "Unknown User"; 
                if (senderSnap.exists()) {
                    senderName = senderSnap.data().name;  // Fetching name from users collection
                }

                collabRequestsHTML += `
                    <p>${senderName} - Status: ${request.status}</p>
                `;
            }
        } else {
            collabRequestsHTML += "<p>No collaboration requests yet.</p>";
        }

        collabRequestsDiv.innerHTML = collabRequestsHTML;

    } catch (error) {
        console.error("Error fetching collaboration requests:", error);
        collabRequestsDiv.innerHTML = "<p>Error loading requests.</p>";
    }
}

function showProjectDetails(project) {
    const projectDetailsDiv = document.getElementById("project-details");

    projectDetailsDiv.innerHTML = `
        <h3>${project.name}</h3>
        <p><strong>Description:</strong> ${project.description}</p>
        <p><strong>Required Skills:</strong> ${project.skills.join(", ")}</p>
        <button class="request-collab-btn" onclick="requestCollaboration('${project.id}', '${project.ownerId}')">
            View Collaboration requests
        </button>
    `;
}



updateProfileDisplay();
