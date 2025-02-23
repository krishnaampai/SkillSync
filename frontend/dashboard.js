import { db } from '../backend/env.js';
import { doc, updateDoc,collection, getDocs ,getDoc,arrayUnion} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { sendCollaborationRequest } from "../backend/collaboration.js";

// Function to find projects by input skills
window.findProjectsByInputSkills = async function() {
    console.log("Find Projects button clicked!");

   
    const inputSkills = document.getElementById("skillsInput").value
        .split(",")
        .map(skill => skill.trim().toLowerCase());

    if (inputSkills.length === 0 || inputSkills[0] === "") {
        alert("Please enter at least one skill.");
        return;
    }

    console.log("Searching for projects that match:", inputSkills);

    try {
        const projectsRef = collection(db, "Project"); 
        const projectsSnapshot = await getDocs(projectsRef);

        let matchingProjects = [];

        projectsSnapshot.forEach(doc => {
            let projectData = doc.data();
            let requiredSkills = (projectData.skills || []).map(skill => skill.toLowerCase());

            
            if (inputSkills.some(skill => requiredSkills.includes(skill))) {
                matchingProjects.push({ id: doc.id, ...projectData });
            }
        });

        displayMatchingProjects(matchingProjects);
    } catch (error) {
        console.error("Error fetching projects:", error);
    }
};

// Function to display matching projects
function displayMatchingProjects(matchingProjects) {
    const projectListContainer = document.getElementById("matching-projects-list");
    projectListContainer.innerHTML = ""; 
    if (matchingProjects.length === 0) {
        projectListContainer.innerHTML = "<p>No matching projects found.</p>";
        return;
    }

    matchingProjects.forEach(project => {
        const projectElement = document.createElement("div");
        projectElement.classList.add("request-item");
        projectElement.innerHTML = `
            <p><strong>${project.name}</strong></p>
            <p>Required Skills: ${project.skills.join(", ")}</p>
            <button onclick="viewProjectDetails('${project.id}')">View Details</button>
        `;
        projectListContainer.appendChild(projectElement);
    });
}



window.viewProjectDetails = async function (projectId) {
    console.log("Fetching project details for ID:", projectId);

    const projectDetailsContainer = document.getElementById("project-details");
    projectDetailsContainer.innerHTML = "Loading...";

    try {
        const projectRef = doc(db, "Project", projectId);
        const projectSnap = await getDoc(projectRef);

        if (!projectSnap.exists()) {
            projectDetailsContainer.innerHTML = "<p>Project not found.</p>";
            return;
        }

        const project = projectSnap.data();

        let collabRequestsHTML = "<p><strong>Collaboration Requests:</strong></p>";
        if (project.collabRequests && project.collabRequests.length > 0) {
            collabRequestsHTML += project.collabRequests.map(request => `
                <p>${request.name} - Status: ${request.status}</p>
            `).join("");
        } else {
            collabRequestsHTML += "<p>No collaboration requests yet.</p>";
        }

        let teamMembersHTML = "<p><strong>Team Members:</strong></p>";
        if (project.teamMembers && project.teamMembers.length > 0) {
            teamMembersHTML += project.teamMembers.map(member => `<p>${member}</p>`).join("");
        } else {
            teamMembersHTML += "<p>No team members yet.</p>";
        }

        projectDetailsContainer.innerHTML = `
        <h2>${project.name}</h2>
        <p><strong>Description:</strong> ${project.description || "No description available."}</p>
        <p><strong>Required Skills:</strong> ${project.skills?.join(", ") || "Not specified"}</p>
        <p><strong>Contact:</strong> ${project.contact || "Not available"}</p>
        ${collabRequestsHTML}
        ${teamMembersHTML}
        <button id="collabRequestBtn">Request to Collaborate</button>
    `;
    
    document.getElementById("collabRequestBtn").addEventListener("click", function() {
        sendCollaborationRequest(projectId);
    });
    
    } catch (error) {
        console.error("Error fetching project details:", error);
        projectDetailsContainer.innerHTML = "<p>Error loading project details.</p>";
    }
};









