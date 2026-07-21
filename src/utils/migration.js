import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, collection, getDocs, setDoc, writeBatch } from "firebase/firestore";
import { db as currentDb } from "../firebase";

// OLD specific config (Antigravity)
const oldConfig = {
    apiKey: "AIzaSyB8pcXtfPjwXbt8Ov63lqX3b4wr-kpzI9s",
    authDomain: "antigravity-portfolio.firebaseapp.com",
    projectId: "antigravity-portfolio",
    storageBucket: "antigravity-portfolio.firebasestorage.app",
    messagingSenderId: "948840564826",
    appId: "1:948840564826:web:6d9764758445cef4a8f063",
};

// Initialize secondary app
const oldApp = initializeApp(oldConfig, "oldApp");
const oldDb = getFirestore(oldApp);

export const migrateData = async () => {
    const status = { success: true, logs: [] };
    const addLog = (msg) => status.logs.push(msg);

    try {
        addLog("Starting migration...");

        // 1. Migrate Portfolio Content
        addLog("Fetching Portfolio Data...");
        const contentRef = doc(oldDb, "content", "portfolioData");
        const contentSnap = await getDoc(contentRef);

        if (contentSnap.exists()) {
            const data = contentSnap.data();
            await setDoc(doc(currentDb, "content", "portfolioData"), data);
            addLog("✅ Portfolio Content migrated.");
        } else {
            addLog("⚠️ No custom content found in old DB.");
        }

        // 2. Migrate Global Settings (Announcements)
        addLog("Fetching Settings...");
        const settingsRef = doc(oldDb, "settings", "global_announcement");
        const settingsSnap = await getDoc(settingsRef);

        if (settingsSnap.exists()) {
            await setDoc(doc(currentDb, "settings", "global_announcement"), settingsSnap.data());
            addLog("✅ Settings migrated.");
        }

        // 3. Migrate Messages (Optional, but good)
        addLog("Fetching Messages...");
        const messagesRef = collection(oldDb, "messages");
        const messagesSnap = await getDocs(messagesRef);

        if (!messagesSnap.empty) {
            const batch = writeBatch(currentDb);
            let count = 0;
            messagesSnap.forEach(docSnap => {
                const newDocRef = doc(currentDb, "messages", docSnap.id);
                batch.set(newDocRef, docSnap.data());
                count++;
            });
            await batch.commit();
            addLog(`✅ Migrated ${count} messages.`);
        } else {
            addLog("No messages to migrate.");
        }

        // 4. Migrate Contact Messages (Legacy)
        // The old app used 'contactMessages', we should merge them into 'messages' for the new unified system
        const oldContactRef = collection(oldDb, "contactMessages");
        const oldContactSnap = await getDocs(oldContactRef);
        if (!oldContactSnap.empty) {
            const batch = writeBatch(currentDb);
            let count = 0;
            oldContactSnap.forEach(docSnap => {
                // Use original ID but put in 'messages' collection
                const newDocRef = doc(currentDb, "messages", "legacy_" + docSnap.id);
                const data = docSnap.data();
                // Ensure 'createdAt' exists (legacy used timestamp)
                if (!data.createdAt && data.timestamp) {
                    // Convert timestamp to ISO string if possible, or just ignore since it's legacy
                    // data.createdAt = new Date(data.timestamp.seconds * 1000).toISOString()
                }
                batch.set(newDocRef, data);
                count++;
            });
            await batch.commit();
            addLog(`✅ Migrated ${count} legacy contact messages.`);
        }

        addLog("🎉 Migration Complete!");

    } catch (error) {
        console.error(error);
        status.success = false;
        addLog(`❌ Error: ${error.message}`);
    }

    return status;
};
