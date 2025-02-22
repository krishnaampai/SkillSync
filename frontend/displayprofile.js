import { auth, db } from "../backend/env.js"; 
export { auth, db };

export async function updateUserProfile(userId, bio, skills, experienceLevel, availability) {
    console.log("Updating profile for user:", userId);
    try {
        if (!db) {
            throw new Error("Firestore is not initialized.");
        }

        const userRef = doc(db, "users", userId);
        await setDoc(userRef, {
            bio,
            skills,
            experienceLevel,
            availability,
            updatedAt: serverTimestamp()
        }, { merge: true });

        console.log("User profile updated successfully!");
    } catch (error) {
        console.error("Error updating profile:", error);
    }
}
