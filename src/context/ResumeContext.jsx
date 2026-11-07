import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { initialResumeData } from '../data/initialResumeData';
import { useToast } from './ToastContext';

const RESUME_STORAGE_KEY = 'resume_data_backup';

const defaultContextValue = {
    resumeData: initialResumeData,
    loading: false,
    saveResume: async () => {},
    resetResume: async () => {}
};

const ResumeContext = createContext(defaultContextValue);

// eslint-disable-next-line react-refresh/only-export-components
export const useResume = () => {
    const context = useContext(ResumeContext);
    return context || defaultContextValue;
};

export const ResumeProvider = ({ children }) => {
    const [resumeData, setResumeData] = useState(() => {
        if (typeof window !== 'undefined') {
            try {
                const local = localStorage.getItem(RESUME_STORAGE_KEY);
                if (local) {
                    const parsed = JSON.parse(local);
                    return { ...initialResumeData, ...parsed };
                }
            } catch {
                // Ignore storage parse errors
            }
        }
        return initialResumeData;
    });

    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        let unsubscribe = () => {};

        // Safety timeout so UI never hangs in loading state
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1200);

        try {
            const docRef = doc(db, 'resume', 'main');
            unsubscribe = onSnapshot(docRef, (docSnap) => {
                clearTimeout(timer);
                if (docSnap.exists()) {
                    const cloud = docSnap.data();
                    const merged = {
                        ...initialResumeData,
                        ...cloud,
                        header: { ...initialResumeData.header, ...(cloud.header || {}) },
                        sectionVisible: { ...initialResumeData.sectionVisible, ...(cloud.sectionVisible || {}) }
                    };
                    setResumeData(merged);
                    try {
                        localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(merged));
                    } catch {
                        // ignore storage errors
                    }
                }
                setLoading(false);
            }, (error) => {
                console.warn("Resume Firestore sync note:", error?.message || error);
                setLoading(false);
            });
        } catch (err) {
            console.warn("Resume init note:", err?.message || err);
        }

        return () => {
            clearTimeout(timer);
            unsubscribe();
        };
    }, []);

    const saveResume = async (newResumeData) => {
        const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        const dataToSave = {
            ...newResumeData,
            updatedAt: dateStr
        };

        // 1. Optimistic update
        setResumeData(dataToSave);

        // 2. Local storage backup
        try {
            localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(dataToSave));
        } catch {
            // ignore
        }

        // 3. Firestore update
        try {
            const docRef = doc(db, 'resume', 'main');
            await setDoc(docRef, dataToSave, { merge: true });
            showToast('Resume saved successfully!', 'success');
            return true;
        } catch (error) {
            console.error("Error saving resume to Firestore:", error);
            showToast(`Saved locally (Cloud sync failed: ${error.message})`, 'warning');
            return false;
        }
    };

    const resetResume = async () => {
        return saveResume(initialResumeData);
    };

    return (
        <ResumeContext.Provider value={{ resumeData, loading, saveResume, resetResume }}>
            {children}
        </ResumeContext.Provider>
    );
};

