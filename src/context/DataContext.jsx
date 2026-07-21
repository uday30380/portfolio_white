import { createContext, useContext, useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useToast } from './ToastContext';

const STORAGE_KEY = 'portfolio_data_backup';

const DataContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useData = () => useContext(DataContext);

// Initial Data Structure for Seeding/Fallback
const initialData = {
    hero: {
        name: "UDAY KIRAN VEMPATI",
        tagline: "Entrepreneur · Designer · Developer · Digital Innovator",
        titles: ["Entrepreneur", "App Store Publisher", "Creative Director", "Full Stack Developer", "RPA Club Designer", "Provision Wing Lead"],
        intro: "I build, brand, and ship products that matter. From publishing apps on the Amazon App Store to leading university clubs and designing for real businesses — I turn ideas into impactful digital realities.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=800&q=80",
        btnPrimary: "See My Work",
        btnSecondary: "Let's Connect",
        expTitle: "Builder",
        expSubtitle: "Since Day One"
    },
    lastModified: Date.now(),
    about: {
        subheading: "WHO I AM",
        heading: "Builder. Creator. Entrepreneur. I make things happen.",
        text1: "I'm Uday Kiran Vempati — a Computer Science student at KL University and a self-driven entrepreneur who doesn't wait for opportunities; I create them. I've published a mobile app on the Amazon App Store, led design teams at university clubs, and delivered real creative work for businesses — all while pursuing my degree.",
        text2: "I bridge the gap between technology and creativity. Whether it's architecting a Java backend, designing a visual identity for a brand, or leading a team of designers as Provision Wing Lead — I bring the same relentless drive to everything. I've competed in hackathons, collaborated with businesses like Eswar Gold & Silver, and been officially recognized by Canva for design excellence. My work spans software development, UI/UX, graphic design, branding, and entrepreneurship.",
        text3: "\"The best way to predict the future is to build it.\" — I live by this. Every project I take on is a bet on myself. I'm not just learning to be a developer — I'm becoming the person who ships products, leads teams, and creates value that lasts.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=800&q=80",
        stats: [
            { label: "Experience", value: "2+ Years" },
            { label: "Projects", value: "10+" },
            { label: "Hackathons", value: "5+" },
            { label: "Apps Published", value: "1+" }
        ]
    },
    skills: [
        {
            id: 1,
            skill: 'Java Development',
            percentage: 90,
            description: "Deep expertise in Java — OOP, multithreading, design patterns, Swing UI, and building production-ready desktop applications from the ground up.",
            iconName: 'Code'
        },
        {
            id: 2,
            skill: 'Database Management',
            percentage: 85,
            description: "Proficient in SQL, schema design, relational modeling, and integrating databases into real-world applications for scalable data handling.",
            iconName: 'Database'
        },
        {
            id: 3,
            skill: 'Creative Design & Branding',
            percentage: 100,
            description: "Expert-level visual designer — posters, brand identities, thumbnails, social media creatives, and cinematic aesthetics using Canva and professional tools. Recognized by Canva officially.",
            iconName: 'Palette'
        }
    ],
    projects: [
        {
            id: 1,
            title: 'Digital File Organizer',
            description: 'A production-grade Java desktop application that automatically manages, categorizes, deduplicates, and backs up your files — built with multithreading for blazing-fast performance.',
            problem: "Cluttered file systems and lack of automated, intelligent backup solutions lead to data loss and wasted hours for power users and professionals.",
            solution: "Engineered a multithreaded Java app with metadata indexing, smart duplicate detection, and full/incremental backup strategies using design patterns.",
            outcome: "Reduced file organization time by 80% for users; achieved 100% data recovery potential through automated, intelligent backups.",
            techUsed: ['Java', 'OOP', 'Multithreading', 'Design Patterns', 'Swing UI'],
            tags: ['Java', 'Automation', 'Desktop App'],
            level: 'Intermediate',
            image: 'https://images.unsplash.com/photo-1555421689-d68471e189f2?fit=crop&w=400&q=80',
            liveLink: 'https://github.com/',
            githubLink: 'https://github.com/',
            timeline: [
                { date: 'Jan 2023', title: 'Research', description: 'User surveys and requirement analysis.' },
                { date: 'Feb 2023', title: 'Prototype', description: 'Initial UI mockups and feedback.' },
                { date: 'Mar 2023', title: 'Development', description: 'Core features implementation.' },
                { date: 'Apr 2023', title: 'Beta Launch', description: 'Testing with pilot users.' },
                { date: 'May 2023', title: 'Public Release', description: 'Full launch to all students.' }
            ],
            imageBefore: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?fit=crop&w=400&q=80',
            imageAfter: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?fit=crop&w=400&q=80',
            faqs: [
                { q: 'What platforms does this support?', a: 'It runs on Windows, macOS, and Linux.' },
                { q: 'Can I customize the backup schedule?', a: 'Yes, via the settings panel.' }
            ],
            rating: 4,
            changelog: [
                { version: '1.0.0', date: 'May 2023', changes: ['Initial public release', 'Basic file management', 'Multithreaded backups'] },
                { version: '1.1.0', date: 'Aug 2023', changes: ['Metadata indexing improvement', 'Bug fixes in duplicate detection'] }
            ],
            contributors: [
                { name: 'Uday Kiran', role: 'Lead Developer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=100' }
            ],
            seo: 90,
            validatedSkills: ['Java Development', 'Multithreading', 'Desktop UI Design'],
            honorsAwards: [
                { title: 'Best Academic Project', organization: 'CSE Dept', date: '2023' }
            ],
            snippets: [
                { language: 'java', title: 'Backup Logic', code: 'public void performBackup() {\n  // Implementation here\n}' }
            ]
        },
        {
            id: 2,
            title: 'Student Health & Wellness Platform',
            description: 'A full-stack, React-powered web platform built to combat student burnout — featuring real-time health tracking, mental wellness resources, fitness analytics, and a personalized dashboard.',
            problem: "Students under academic pressure consistently neglect their health, with no centralized, student-friendly platform to monitor or improve their wellness habits.",
            solution: "Built a beautiful, responsive React app with Firebase real-time sync, Chart.js analytics, and curated wellness resources designed specifically for student life.",
            outcome: "Improved student health awareness by providing actionable, data-driven insights in a platform they actually want to use.",
            techUsed: ['React', 'Firebase', 'Tailwind', 'Chart.js', 'Framer Motion'],
            tags: ['Health Tech', 'Web App', 'Analytics'],
            level: 'Intermediate',
            image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?fit=crop&w=400&q=80',
            liveLink: 'https://github.com/',
            githubLink: 'https://github.com/',
            timeline: [
                { date: 'Jan 2024', title: 'Concept', description: 'Initial project idea and requirements gathering.' },
                { date: 'Feb 2024', title: 'Design', description: 'Architecture design and UI mockups.' },
                { date: 'Mar 2024', title: 'Development', description: 'Core functionality implementation.' },
                { date: 'Apr 2024', title: 'Testing', description: 'Bug fixing and performance tuning.' },
                { date: 'May 2024', title: 'Release', description: 'Final deployment and documentation.' }
            ],
            imageBefore: 'https://images.unsplash.com/photo-1555421689-d68471e189f2?fit=crop&w=400&q=80',
            imageAfter: 'https://images.unsplash.com/photo-1555421689-d68471e189f2?fit=crop&w=400&q=80',
            faqs: [
                { q: 'What platforms does this support?', a: 'It is a responsive web app — works on all devices.' },
                { q: 'Is health data stored securely?', a: 'Yes, Firebase Security Rules protect all user data.' }
            ],
            rating: 4,
            changelog: [
                { version: '1.0.0', date: 'May 2024', changes: ['Stable release with health tracking', 'Mental wellness resources integration'] }
            ],
            contributors: [
                { name: 'Uday Kiran', role: 'Full Stack Developer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=100' }
            ],
            seo: 95,
            validatedSkills: ['React Framework', 'Responsive Design', 'API Integration'],
            honorsAwards: [
                { title: 'Innovation Award', organization: 'HealthHack', date: '2024' }
            ],
            snippets: [
                { language: 'javascript', title: 'Health tracker', code: 'const trackHealth = (data) => {\n  return calculateScore(data);\n}' }
            ]
        },
        {
            id: 3,
            title: 'CIP-AP Portal',
            description: 'A secure, enterprise-grade government web portal engineered for the Crime Investigation Department of Andhra Pradesh — delivering structured digital resources with modern UX and rigorous security.',
            problem: "Law enforcement personnel lacked a centralized, secure, and user-friendly digital interface to access critical resources and structured information efficiently.",
            solution: "Designed and developed a role-based access portal with a React frontend, Node.js backend, and hardened security protocols tailored for government use.",
            outcome: "Dramatically improved resource accessibility and operational efficiency for CID AP personnel with a secure, scalable platform.",
            techUsed: ['React', 'Node.js', 'Security Protocols', 'Database', 'Role-Based Access'],
            tags: ['GovTech', 'Full Stack', 'Security'],
            level: 'Advanced',
            image: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?fit=crop&w=400&q=80',
            liveLink: 'https://github.com/',
            githubLink: 'https://github.com/',
            timeline: [
                { date: 'Jun 2022', title: 'Planning', description: 'Stakeholder meetings and scope definition.' },
                { date: 'Jul 2022', title: 'Design', description: 'Architecture and UI design.' },
                { date: 'Aug 2022', title: 'Implementation', description: 'Core modules development.' },
                { date: 'Sep 2022', title: 'Security Audit', description: 'Full security audits and penetration testing.' },
                { date: 'Oct 2022', title: 'Deployment', description: 'Production rollout and handover.' }
            ],
            imageBefore: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?fit=crop&w=400&q=80',
            imageAfter: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?fit=crop&w=400&q=80',
            faqs: [
                { q: 'Who can access the portal?', a: 'Authorized law enforcement personnel only, with role-based authentication.' },
                { q: 'Is there a mobile version?', a: 'Fully responsive — optimized for tablets and field devices.' }
            ],
            rating: 4,
            changelog: [
                { version: '1.0.0', date: 'Oct 2022', changes: ['Portal deployment for CID AP', 'Secure resource management', 'Role-based access control'] }
            ],
            contributors: [
                { name: 'Uday Kiran', role: 'Lead Developer & Security Analyst', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=100' }
            ],
            seo: 85,
            validatedSkills: ['Secure Portal Design', 'Node.js Backend', 'Information Architecture'],
            honorsAwards: [
                { title: 'Merit Certificate', organization: 'CID AP', date: '2022' }
            ],
            snippets: [
                { language: 'javascript', title: 'Auth Guard', code: '// Role-based route protection\nfunction authGuard(role) {\n  return currentUser?.role === role;\n}' }
            ]
        }
    ],
    testimonials: [
        {
            id: 1,
            name: "ESWAR GOLD AND SILVER",
            role: "Brand Collaboration",
            company: "ESWAR GOLD AND SILVER",
            avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?fit=crop&w=100",
            text: "We collaborated with Uday Kiran from Vempati Creations for our cover song poster designs, and we were truly impressed by his creativity, attention to detail, and unique visual style. His designs captured the essence of our project perfectly. A true creative professional."
        }
    ],
    achievements: [
        {
            id: 1,
            title: "Entrepreneur & Amazon App Store Publisher",
            organization: "Amazon App Store",
            date: "2025",
            description: "Conceptualized, developed, and independently published a mobile application on the Amazon App Store — handling everything from ideation and coding to deployment and distribution. A rare achievement for a sophomore student."
        },
        {
            id: 2,
            title: "RPA Club Designer & Web Administrator",
            organization: "RPA Club, KL University",
            date: "2025 – Present",
            description: "Leading all visual design operations and managing the complete web infrastructure for the RPA Club. Responsible for brand identity, digital campaigns, and ensuring a seamless online presence that represents the club's mission."
        },
        {
            id: 3,
            title: "Provision Wing Lead – Graphic Design",
            organization: "FOCUS Club, CSE Dept.",
            date: "September 2025",
            description: "Appointed as Provision Wing Lead for graphic design — the youngest person in this leadership role. Overseeing large-scale design campaigns, mentoring a team of creative designers, and driving the club's visual communication strategy."
        },
        {
            id: 4,
            title: "Officially Recognized by Canva",
            organization: "Canva",
            date: "2025",
            description: "Received official recognition from Canva for outstanding design contributions and creative excellence. Earned Canva Essentials and Canva for Work certifications — proof of mastery in professional-grade digital design."
        },
        {
            id: 5,
            title: "Brand Designer – Vempati Creations",
            organization: "ESWAR GOLD AND SILVER",
            date: "November 2025",
            description: "Delivered high-impact creative work for a real business client through Vempati Creations — designing cover song posters with cinematic aesthetics, bold typography, and distinct visual branding. Earned a glowing client testimonial."
        },
        {
            id: 6,
            title: "Hackathon Competitor & Innovator",
            organization: "Multiple Tech Events",
            date: "2023 – Present",
            description: "Actively participated in 5+ hackathons and technical events, consistently delivering innovative solutions under pressure. Each event sharpened problem-solving skills, teamwork, and the ability to ship fast without sacrificing quality."
        }
    ],
    settings: {
        seoTitle: "Uday Kiran Vempati | Entrepreneur · Designer · Developer | KL University",
        seoDescription: "Official portfolio of Uday Kiran Vempati — entrepreneur, Amazon App Store publisher, creative director, full stack developer, and design leader at KL University. Recognized by Canva."
    },
    contact: {
        phone: "+91 81858 92753",
        email: "udaykiranvempati123@gmail.com",
        instagram: "@udaykiranvempati",
        creations: "@designedbyudaykiran",
        github: "https://github.com/",
        linkedin: "https://linkedin.com/"
    },
    footer: {
        tagline: "Entrepreneur & Creative Director building next-gen digital products that leave a mark.",
        copyright: `© ${new Date().getFullYear()} Uday Kiran Vempati. All rights reserved.`,
        links: [
            { name: 'Instagram', url: 'https://instagram.com/udaykiranvempati' },
            { name: 'LinkedIn', url: 'https://linkedin.com/in/udaykiranvempati' },
            { name: 'GitHub', url: 'https://github.com/udaykiranvempati' }
        ]
    },
    resume: {
        link: "",
        enabled: true,
        lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    },
    certificates: [],
    honors: [],
    validatedSkills: [],
    blog: [
        {
            id: 1,
            title: "From Student to Entrepreneur: Publishing My First App on Amazon",
            excerpt: "What it really takes to go from an idea to a live product on the Amazon App Store — the hustle, the failures, and what I learned shipping my first app as a college student.",
            content: `# From Student to Entrepreneur: Publishing My First App on Amazon\n\nMost people wait. I decided to build.\n\nAs a second-year Computer Science student, I set out to do something most of my peers hadn't attempted — publish a real product on the Amazon App Store.\n\n## The Idea\n\nIt started with a problem I noticed. A gap that no existing app was filling well enough. Instead of complaining about it, I opened my IDE and started building.\n\n## The Build\n\nBuilding solo is humbling. You're the developer, the designer, the QA tester, and the product manager — all at once. There were nights of debugging, redesigns, and moments of self-doubt. But also moments of pure flow where the code just worked.\n\n## The Launch\n\nSubmitting to the Amazon App Store was a milestone. Seeing my app live — available to anyone in the world — was one of the proudest moments of my life so far.\n\n## What I Learned\n\nEntrepreneurship isn't about waiting to be ready. It's about starting before you feel ready, learning from every mistake, and shipping anyway.\n\n## Conclusion\n\nIf you have an idea, build it. The best time to start was yesterday. The second best time is right now.`,
            date: "January 2026",
            readTime: "6 min read",
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000",
            images: [
                "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000",
                "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1000",
                "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1000"
            ],
            tags: ["Entrepreneurship", "App Development", "Amazon", "Student Life"],
            author: "Uday Kiran Vempati"
        }
    ]
};

export const DataProvider = ({ children }) => {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    // Initial Fetch from Firebase
    useEffect(() => {
        let unsubscribe = () => { };

        // Safety Timeout to prevent infinite loading
        const safetyTimer = setTimeout(() => {
            if (loading) {
                console.warn("⚠️ DataContext: Loading timed out. Forcing app load with fallback data.");
                setLoading(false);
                showToast('Database Connection Slow - Loaded Offline Data', 'info');
            }
        }, 8000);

        try {
            const docRef = doc(db, "content", "portfolioData");
            unsubscribe = onSnapshot(docRef, async (docSnap) => {
                clearTimeout(safetyTimer); // Clear timeout on success
                try {
                    if (docSnap.exists()) {
                        console.log("✅ Data successfully fetched from Firestore!");
                        const cloudData = docSnap.data();

                        // Conflict Resolution: Prefer the NEWER data
                        const localBackup = localStorage.getItem(STORAGE_KEY);
                        let localData = null;
                        if (localBackup) {
                            try { localData = JSON.parse(localBackup); } catch { /* ignore */ }
                        }

                        // Determine timestamp priority
                        const cloudTime = cloudData.lastModified || 0;
                        const localTime = localData?.lastModified || 0;

                        if (cloudTime > localTime) {
                            console.log("☁️ Cloud is newer. Updating app.");
                            setData(prev => ({ ...prev, ...cloudData }));
                            localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, ...cloudData }));
                        } else if (localTime > cloudTime) {
                            console.warn("💾 Local is newer. Ignoring stale cloud data (pending sync).");
                            // We keep local state. Optionally, we could try to push local to cloud here.
                            if (localData) setData(localData);
                            showToast('Using Newer Local Data (Cloud Sync Pending)', 'info');
                        } else {
                            // Equal or no timestamps, merge safely
                            setData(prev => ({ ...prev, ...cloudData }));
                        }
                    } else {
                        console.log("⚠️ Document missing. Checking Local Backup...");
                        const localBackup = localStorage.getItem(STORAGE_KEY);

                        if (localBackup) {
                            console.log("Found Local Backup - Restoring...");
                            const parsed = JSON.parse(localBackup);
                            setData(parsed);
                            showToast('Restored Data from Local Backup', 'success');
                        } else {
                            console.log("No backup found. Using defaults.");
                            // Existing auto-seed logic (Disabled)
                            if (auth.currentUser) {
                                console.warn("Auto-seeding disabled.");
                                showToast('New Database - Please Save Settings', 'info');
                            }
                        }
                    }
                } catch (innerError) {
                    console.error("Error processing snapshot:", innerError);
                    showToast(`Data Error: ${innerError.message}`, 'error');
                }
                setLoading(false);
            }, (error) => {
                clearTimeout(safetyTimer);
                console.error("❌ DataContext Error:", error);

                // Fallback to LocalStorage on Connection Error
                const localBackup = localStorage.getItem(STORAGE_KEY);
                if (localBackup) {
                    console.log("⚠️ Connection Failed. Using Local Backup.");
                    setData(JSON.parse(localBackup));
                    showToast('Offline Mode: Loaded Local Data', 'warning');
                } else {
                    let msg = "Database Connection Failed";
                    if (error.code === 'permission-denied') msg = "Access Denied (Check Rules)";
                    showToast(msg, 'error');
                }
                setLoading(false);
            });
        } catch (err) {
            clearTimeout(safetyTimer);
            console.error("DataContext Setup Error:", err);

            // Fallback for setup errors
            const localBackup = localStorage.getItem(STORAGE_KEY);
            if (localBackup) {

                setData(JSON.parse(localBackup));
            }

            showToast(`Setup Error: ${err.message}`, 'error');
            setLoading(false);
        }

        return () => {
            clearTimeout(safetyTimer);
            try {
                unsubscribe();
            } catch (e) {
                console.error("Error unsubscribing in DataContext:", e);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showToast]);

    // LocalStorage Key
    // LocalStorage Key (Moved to top)

    const updateData = async (section, newData) => {
        const timestamp = Date.now();
        const updatedFullData = {
            ...data,
            [section]: newData,
            lastModified: timestamp // Update timestamp
        };

        // 1. Optimistic Update
        setData(updatedFullData);

        // 2. Local Backup (Failsafe)
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFullData));
        } catch (e) {
            console.error("Local backup failed:", e);
        }

        // 3. Firebase Update
        try {
            const docRef = doc(db, "content", "portfolioData");
            // Merge the specific section AND the timestamp
            await setDoc(docRef, { [section]: newData, lastModified: timestamp }, { merge: true });
            showToast('Changes Saved', 'success');
        } catch (error) {
            console.error("Error updating document: ", error);
            showToast(`Cloud Save Failed (Saved Locally): ${error.message}`, 'warning');
            // We do NOT revert state because we have a local backup now.
        }
    };

    const resetData = async () => {
        if (!window.confirm("WARNING: This will overwrite your current database with the Default Template. Are you sure?")) {
            return;
        }

        try {
            console.log("Initiating Manual Data Reset...");

            // 1. Update State
            setData(initialData);

            // 2. Update Local Backup
            localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));

            // 3. Update Firestore
            if (auth.currentUser) {
                const docRef = doc(db, "content", "portfolioData");
                await setDoc(docRef, initialData);
                showToast('Success: Database Restored to Defaults', 'success');
            } else {
                showToast('Reset Local Data (Admin Login Required for Cloud Save)', 'info');
            }

        } catch (error) {
            console.error("Reset failed:", error);
            showToast(`Reset Failed: ${error.message}`, 'error');
        }
    };

    return (
        <DataContext.Provider value={{ data, updateData, loading, resetData }}>
            {children}
        </DataContext.Provider>
    );
};
