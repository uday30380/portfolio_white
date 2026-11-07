import { createContext, useContext, useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useToast } from './ToastContext';
import { sanitizeData } from '../utils/imageSanitizer';

const STORAGE_KEY = 'portfolio_data_backup';

// Initial Data Structure for Seeding/Fallback
const initialData = {
    hero: {
        name: "UDAY KIRAN VEMPATI",
        tagline: "Entrepreneur · Designer · Developer · Digital Innovator",
        titles: ["Entrepreneur", "App Store Publisher", "Creative Director", "Full Stack Developer", "RPA Club Designer", "Provision Wing Lead"],
        intro: "I build, brand, and ship products that matter. From publishing apps on the Amazon App Store to leading university clubs and designing for real businesses — I turn ideas into impactful digital realities.",
        image: "/uday-portrait.png",
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
        image: "/uday-portrait.png",
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
            iconName: 'PenTool'
        },
        {
            id: 4,
            skill: 'Full Stack Web (React & Firebase)',
            percentage: 92,
            description: "Building responsive, modern, production web applications with React, Tailwind CSS, Firebase Firestore, Authentication, and Cloud Functions.",
            iconName: 'Layout'
        }
    ],
    projects: [
        {
                "title": "SIMPLETASKS",
                "validatedSkills": [],
                "performance": {
                        "seo": 78,
                        "score": 99,
                        "accessibility": 85,
                        "loadTime": "1"
                },
                "image": "https://i.postimg.cc/hjqhzvLx/image.png",
                "duration": "",
                "snippets": [],
                "changelog": [],
                "metrics": {},
                "level": "Advanced",
                "honorsAwards": [
                        {
                                "title": "Recognition for Productivity Application Development",
                                "date": "2026",
                                "organization": "KL University (Dean of Academics)"
                        },
                        {
                                "organization": "Amazon Appstore",
                                "date": "2026",
                                "title": "Application Published on Amazon Appstore"
                        }
                ],
                "liveLink": "https://www.simpletasks.online",
                "imagePath": "",
                "faqs": [],
                "featured": false,
                "tags": [
                        "anti gravity",
                        "firebase",
                        "react",
                        "java script",
                        "Web Development, Frontend, Productivity App, Task Management, UI/UX"
                ],
                "order": 0,
                "problem": "Users often struggle to manage daily tasks effectively due to lack of simple and accessible tools. Many existing applications are overly complex for basic task tracking.",
                "imageAfter": "https://i.postimg.cc/hjqhzvLx/image.png",
                "githubLink": "https://github.com/uday30380/simple-to-do-list1.git",
                "teamSize": "",
                "techUsed": [
                        "HTML, CSS, JavaScript, Local Storage"
                ],
                "description": "The Simple To-Do List is a lightweight and efficient task management web application designed to help users organize their daily activities. It provides a clean and intuitive interface where users can add, update, and delete tasks seamlessly.\n\nThe application focuses on simplicity and usability, allowing users to manage their tasks without distractions. It demonstrates core frontend development concepts such as DOM manipulation, event handling, and state management while ensuring a responsive design across devices.",
                "status": "published",
                "outcome": "Successfully built a functional and responsive application that improves productivity and task organization. It demonstrates strong understanding of frontend fundamentals and practical implementation skil",
                "rating": 5,
                "imageBefore": "https://i.postimg.cc/hjqhzvLx/image.png",
                "contributors": [],
                "id": 1767603981982,
                "solution": "Developed a simple and user-friendly to-do list application that allows users to easily add, edit, and delete tasks. The application provides instant updates and ensures smooth interaction.",
                "completionDate": "",
                "timeline": []
        },
        {
                "githubLink": "https://github.com/uday30380/Eswar-gold-and-sliver.git",
                "title": "ESWAR GOLD AND SLIVER",
                "imageBefore": "https://i.postimg.cc/K8CtZYvH/Cinzel_(2).jpg",
                "level": "Advanced",
                "imageAfter": "https://i.postimg.cc/K8CtZYvH/Cinzel_(2).jpg",
                "tags": [],
                "id": 1767605520293,
                "image": "https://i.postimg.cc/K8CtZYvH/Cinzel_(2).jpg",
                "description": "ESWAR Gold and Silver is a trusted jewelry business offering high-quality gold and silver ornaments, known for purity, craftsmanship, and customer satisfaction.",
                "techUsed": [],
                "featured": false,
                "liveLink": "https://eswar-gold-silver.web.app/"
        },
        {
                "githubLink": "",
                "imageAfter": "https://i.postimg.cc/dt78N91F/image.png",
                "imageBefore": "https://i.postimg.cc/dt78N91F/image.png",
                "title": "LOOT BAZZARE",
                "level": "Advanced",
                "tags": [
                        "Full stack",
                        "AI CSS",
                        "Project no.1"
                ],
                "featured": false,
                "id": 1768028656771,
                "liveLink": "https://lootbazzare.vercel.app/",
                "techUsed": [],
                "image": "https://i.postimg.cc/dt78N91F/image.png",
                "description": "LOOTBAZZARE"
        },
        {
                "metrics": {},
                "changelog": [],
                "completionDate": "",
                "tags": [
                        "Firebase Firestore",
                        "Postman, Git, GitHub"
                ],
                "featured": false,
                "performance": {
                        "accessibility": 0,
                        "seo": 0,
                        "loadTime": "",
                        "score": 0
                },
                "liveLink": "https://rpa-club.web.app/",
                "validatedSkills": [],
                "imagePath": "",
                "order": 0,
                "duration": "",
                "honorsAwards": [],
                "snippets": [],
                "outcome": "Successfully deployed a functional backend that supports smooth data flow, user management, and future scalability for club operations.",
                "level": "Advanced",
                "description": "A centralized web platform for the RPA Club at KL University to manage club activities, members, events, and administrative workflows efficiently.",
                "rating": 5,
                "id": 1770213463333,
                "solution": "Designed and developed the backend architecture to handle authentication, database operations, API integrations, and secure data management for the club website.",
                "imageAfter": "https://i.postimg.cc/Y9kXV9Jq/image.png",
                "timeline": [],
                "githubLink": "https://rpa-club.web.app/",
                "imageBefore": "https://i.postimg.cc/Y9kXV9Jq/image.png",
                "faqs": [],
                "status": "published",
                "title": "RPA Club Website",
                "problem": "The club needed a scalable and secure platform to manage member data, events, and internal workflows digitally instead of manual processes.",
                "contributors": [],
                "techUsed": [
                        "Firebase, REST APIs"
                ],
                "teamSize": "",
                "image": "https://i.postimg.cc/Y9kXV9Jq/image.png"
        },
        {
                "featured": false,
                "honorsAwards": [
                        {
                                "title": "Successfully developed and deployed real-world client project Recognized for modern UI/UX design Built as part of portfolio showcasing real-world applications",
                                "date": "24-03-2026",
                                "organization": "Snackhub founder"
                        }
                ],
                "liveLink": "https://snackhub.in/",
                "imagePath": "",
                "githubLink": "",
                "rating": 5,
                "imageAfter": "https://i.postimg.cc/02Wk6kR6/Orange_Modern_Fresh_Burger_Promotion_Poster.jpg",
                "imageBefore": "https://i.postimg.cc/02Wk6kR6/Orange_Modern_Fresh_Burger_Promotion_Poster.jpg",
                "status": "published",
                "duration": "",
                "snippets": [],
                "description": "SnackHub is a food-based web platform designed to deliver a unique blend of traditional street food and modern gourmet presentation. The platform allows users to explore a wide variety of snacks including pizzas, cakes, burgers, Chinese items, shawarma, and beverages.\n\nThe idea behind SnackHub is to elevate street food by maintaining premium quality ingredients, hygienic preparation, and visually appealing UI/UX. The website provides a seamless browsing experience where users can explore menu items, understand the brand story, and interact with a modern interface.\n\nSnackHub was conceptualized with a strong focus on quality and customer satisfaction, ensuring all products are freshly prepared and delivered with consistency.",
                "metrics": {},
                "validatedSkills": [
                        "Web Development UI/UX Design Frontend Development Firebase Integration Responsive Design"
                ],
                "changelog": [],
                "id": 1774358842434,
                "completionDate": "",
                "tags": [
                        "Food / Restaurant / Web Application"
                ],
                "order": 0,
                "faqs": [],
                "solution": "SnackHub provides a clean, visually appealing, and modern website that showcases street food as a premium experience with strong branding and user-friendly design.",
                "problem": "Street food platforms often lack proper branding, hygiene representation, and modern UI/UX, making it difficult to attract premium customers.",
                "timeline": [],
                "contributors": [],
                "level": "Advanced",
                "teamSize": "",
                "techUsed": [
                        "HTML, CSS, JavaScript, Firebase"
                ],
                "performance": {
                        "accessibility": 90,
                        "loadTime": "1.5",
                        "score": 85,
                        "seo": 95
                },
                "image": "https://i.postimg.cc/02Wk6kR6/Orange_Modern_Fresh_Burger_Promotion_Poster.jpg",
                "outcome": "Improved user engagement\nBetter visual representation of food items\nEnhanced brand identity\nEasy navigation and browsing experience",
                "title": "SnackHub \u2013 Street Food Meets Gourmet Experience"
        },
        {
                "validatedSkills": [
                        "Frontend Development Responsive Design UI/UX Design Firebase Deployment Problem Solving AI-based Thinking Hackathon Execution"
                ],
                "title": "Max Life Safe Insurance",
                "rating": 5,
                "snippets": [],
                "performance": {
                        "seo": 80,
                        "score": 98,
                        "accessibility": 85,
                        "loadTime": "1.5"
                },
                "changelog": [],
                "duration": "",
                "outcome": "\n\nSuccessfully built and deployed a functional web application during the Guidewire Hackathon. The project demonstrates the ability to solve real-world problems using technology, with a focus on user-centric design and social impact.",
                "image": "https://i.postimg.cc/HsMK3LX1/image.png",
                "faqs": [],
                "status": "published",
                "level": "Intermediate",
                "honorsAwards": [
                        {
                                "organization": "Guidewire Software Company",
                                "title": "Guidewire Hackathon \u2013 Participation Certificate",
                                "date": "18-04-2026"
                        }
                ],
                "featured": false,
                "liveLink": "https://maxlife-safe-insurance.web.app/",
                "completionDate": "",
                "problem": "Gig workers depend on daily income and are highly vulnerable during natural disasters such as floods or cyclones. When such events occur, they are unable to work and often struggle to access food, shelter, and critical information.",
                "imagePath": "",
                "order": 0,
                "tags": [
                        "Web Development, Frontend, Hackathon Project, AI Assistance, Disaster Management, Gig Workers, UI/UX"
                ],
                "description": "Short Description\n\nAn AI-powered assistance platform designed to support gig workers during natural disasters by providing essential guidance, resources, and survival support.\n\nNarrative Description\n\nMax Life Safe Assistance is a web-based application developed during the Guidewire Hackathon to address a real-world problem faced by gig workers. During emergencies such as floods, cyclones, or other natural disasters, gig workers often lose access to income and basic necessities.\n\nThis platform uses an AI-driven assistance approach to guide users during such critical situations. It helps them find nearby resources, essential support, and survival guidance to avoid situations like hunger, lack of shelter, or isolation. The application focuses on accessibility, simplicity, and quick response, ensuring that users can rely on it during high-risk conditions.",
                "metrics": {},
                "techUsed": [
                        "HTML, CSS, JavaScript, Firebase Hosting, SVG"
                ],
                "teamSize": "",
                "imageBefore": "https://i.postimg.cc/HsMK3LX1/image.png",
                "imageAfter": "https://i.postimg.cc/HsMK3LX1/image.png",
                "id": 1776575439303,
                "githubLink": "https://github.com/uday30380/maxlife-safe-insurance.git",
                "timeline": [],
                "contributors": [],
                "solution": "Developed an AI-powered assistance platform that helps gig workers during emergencies by providing guidance, support resources, and essential information. The system is designed to be simple, fast, and accessible, even under stressful conditions.\n\n"
        },
        {
                "id": 1787658988434,
                "teamSize": "",
                "techUsed": [],
                "imageBefore": "https://i.postimg.cc/TPpgLSdr/image.png",
                "validatedSkills": [],
                "level": "Intermediate",
                "problem": "",
                "tags": [],
                "completionDate": "",
                "imagePath": "",
                "timeline": [],
                "solution": "",
                "title": "Prime App Connect ",
                "imageAfter": "https://i.postimg.cc/TPpgLSdr/image.png",
                "outcome": "",
                "changelog": [],
                "contributors": [],
                "githubLink": "",
                "description": "Agency",
                "image": "https://i.postimg.cc/TPpgLSdr/image.png",
                "rating": 5,
                "snippets": [],
                "duration": "",
                "liveLink": "https://www.primeappconnect.com/",
                "featured": false,
                "faqs": [],
                "order": 0,
                "metrics": {},
                "honorsAwards": [],
                "performance": {
                        "loadTime": "",
                        "score": 0,
                        "seo": 0,
                        "accessibility": 0
                },
                "status": "published"
        },
        {
                "completionDate": "",
                "imageAfter": "https://i.ibb.co/hFJHNxz1/images.png",
                "description": "CSE STUDENT BODY\n",
                "order": 0,
                "githubLink": "",
                "featured": false,
                "liveLink": "https://klfocus.in/",
                "metrics": {},
                "faqs": [],
                "honorsAwards": [],
                "snippets": [],
                "duration": "",
                "imageBefore": "https://i.ibb.co/hFJHNxz1/images.png",
                "id": 1789178082570,
                "performance": {
                        "loadTime": "",
                        "accessibility": 0,
                        "seo": 0,
                        "score": 0
                },
                "status": "published",
                "changelog": [],
                "title": "Focus(Student Body Website)",
                "timeline": [],
                "image": "https://i.ibb.co/hFJHNxz1/images.png",
                "outcome": "",
                "tags": [
                        "Student body",
                        "Focus"
                ],
                "solution": "",
                "contributors": [],
                "level": "Intermediate",
                "validatedSkills": [],
                "imagePath": "",
                "rating": 5,
                "problem": "",
                "teamSize": "",
                "techUsed": [
                        "Java",
                        "react",
                        "tawlind css"
                ]
        },
        {
                "solution": "",
                "performance": {
                        "score": 0,
                        "accessibility": 0,
                        "loadTime": "",
                        "seo": 0
                },
                "timeline": [],
                "outcome": "",
                "honorsAwards": [],
                "teamSize": "",
                "techUsed": [],
                "tags": [],
                "problem": "",
                "validatedSkills": [],
                "order": 0,
                "githubLink": "",
                "description": "Project No.6",
                "imageAfter": "https://i.ibb.co/ccfRfJCB/Screenshot-2026-09-15-172158.png",
                "featured": false,
                "metrics": {},
                "liveLink": "https://www.srivenkataramanajyothishyam.in/",
                "id": 1789473150299,
                "level": "Intermediate",
                "faqs": [],
                "changelog": [],
                "completionDate": "",
                "rating": 5,
                "duration": "",
                "image": "https://i.ibb.co/ccfRfJCB/Screenshot-2026-09-15-172158.png",
                "status": "published",
                "contributors": [],
                "snippets": [],
                "title": "SRI VENKATARAMANA JYOTHISHYA PEETHAM",
                "imageBefore": "https://i.ibb.co/ccfRfJCB/Screenshot-2026-09-15-172158.png",
                "imagePath": ""
        },
        {
                "snippets": [],
                "imagePath": "",
                "duration": "",
                "imageBefore": "https://i.ibb.co/RpqmZy8q/Screenshot-2026-09-24-215726.png",
                "level": "Intermediate",
                "contributors": [],
                "validatedSkills": [],
                "metrics": {},
                "featured": false,
                "changelog": [],
                "image": "https://i.ibb.co/RpqmZy8q/Screenshot-2026-09-24-215726.png",
                "liveLink": "https://referx.in/",
                "title": "Referx",
                "faqs": [],
                "description": "System Workflow\nWhatsApp Automation \u2192 Tasks \u2192 Referrals \u2192 Earnings \u2192 Withdrawal\nA transparent, unified software workflow built for reliability and real performance tracking.",
                "githubLink": "",
                "imageAfter": "https://i.ibb.co/RpqmZy8q/Screenshot-2026-09-24-215726.png",
                "status": "published",
                "tags": [],
                "teamSize": "",
                "techUsed": [],
                "id": 1790267301518,
                "outcome": "",
                "honorsAwards": [],
                "timeline": [],
                "completionDate": "",
                "solution": "",
                "order": 0,
                "performance": {
                        "loadTime": "",
                        "score": 0,
                        "seo": 0,
                        "accessibility": 0
                },
                "problem": "",
                "rating": 5
        },
        {
                "honorsAwards": [],
                "imageAfter": "https://i.ibb.co/NnYzdRwN/Screenshot-2026-10-11-140613.png",
                "problem": "",
                "status": "published",
                "timeline": [],
                "githubLink": "",
                "imageBefore": "https://i.ibb.co/NnYzdRwN/Screenshot-2026-10-11-140613.png",
                "solution": "",
                "changelog": [],
                "id": 1791707894681,
                "description": "SAMYAK is the premier annual National Level Techno-Management Fest of Koneru Lakshmaiah Education Foundation (KL University). Born as a beacon of student-driven ambition, it unites visionary engineers, artists, strategists, and gamers in a 3-day immersive odyssey.",
                "rating": 5,
                "faqs": [],
                "outcome": "",
                "order": 0,
                "validatedSkills": [],
                "teamSize": "",
                "techUsed": [
                        "REACT",
                        "JAVASCRIPT",
                        "FIREBASE",
                        "CLOUDFARE"
                ],
                "imagePath": "",
                "contributors": [],
                "tags": [
                        "KL UNIVERSITY",
                        "KLU",
                        "SAMYAK2026",
                        "WEBSITE CHEIF"
                ],
                "level": "Intermediate",
                "liveLink": "http://klsamyak.in/",
                "featured": false,
                "completionDate": "",
                "image": "https://i.ibb.co/NnYzdRwN/Screenshot-2026-10-11-140613.png",
                "performance": {
                        "seo": 0,
                        "accessibility": 0,
                        "score": 0,
                        "loadTime": ""
                },
                "title": "SAMYAK 2026",
                "snippets": [],
                "metrics": {},
                "duration": ""
        }
],
    testimonials: [
        {
            id: 1,
            name: "ESWAR GOLD AND SILVER",
            role: "Brand Collaboration",
            company: "ESWAR GOLD AND SILVER",
            avatar: "/uday-portrait.png",
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
    btechJourney: {
        sectionTitle: '4 Years of Building & Growing',
        sectionSubtitle: 'Every session, every event, every moment of hustle — captured and preserved. This is my B.Tech story at KL University.',
        highlights: [
            {
                id: 1,
                title: 'Firebase Session – RPA Club',
                description: 'An exciting Firebase workshop session conducted under the RPA Club at KL University. Deep dive into Firebase Realtime Database and Authentication.',
                url: '/firebase-session-rpa-club.mp4',
                type: 'local-video',
                year: 'Year 2',
                isShort: false,
            },
            {
                id: 2,
                title: 'Focus Under Pressure',
                description: 'Documenting the journey of staying focused and delivering under academic pressure. Every deadline, every late night, every win.',
                url: '/focus-under.mp4',
                type: 'local-video',
                year: 'Year 2',
                isShort: false,
            },
        ]
    },
    blog: [
        {
            id: 1,
            title: "From Student to Entrepreneur: Publishing My First App on Amazon",
            excerpt: "What it really takes to go from an idea to a live product on the Amazon App Store — the hustle, the failures, and what I learned shipping my first app as a college student.",
            content: `# From Student to Entrepreneur: Publishing My First App on Amazon\n\nMost people wait. I decided to build.\n\nAs a second-year Computer Science student, I set out to do something most of my peers hadn't attempted — publish a real product on the Amazon App Store.\n\n## The Idea\n\nIt started with a problem I noticed. A gap that no existing app was filling well enough. Instead of complaining about it, I opened my IDE and started building.\n\n## The Build\n\nBuilding solo is humbling. You're the developer, the designer, the QA tester, and the product manager — all at once. There were nights of debugging, redesigns, and moments of self-doubt. But also moments of pure flow where the code just worked.\n\n## The Launch\n\nSubmitting to the Amazon App Store was a milestone. Seeing my app live — available to anyone in the world — was one of the proudest moments of my life so far.\n\n## What I Learned\n\nEntrepreneurship isn't about waiting to be ready. It's about starting before you feel ready, learning from every mistake, and shipping anyway.\n\n## Conclusion\n\nIf you have an idea, build it. The best time to start was yesterday. The second best time is right now.`,
            date: "January 2026",
            readTime: "6 min read",
            image: "/uday-portrait.png",
            images: [
                "/uday-portrait.png"
            ],
            tags: ["Entrepreneurship", "App Development", "Amazon", "Student Life"],
            author: "Uday Kiran Vempati"
        }
    ]
};

const defaultContextValue = {
    data: initialData,
    loading: false,
    updateData: async () => {},
    resetData: async () => {}
};

const DataContext = createContext(defaultContextValue);

// eslint-disable-next-line react-refresh/only-export-components
export const useData = () => {
    const context = useContext(DataContext);
    return context || defaultContextValue;
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
                showToast('Loaded Offline Data', 'info');
            }
        }, 2500);

        try {
            const docRef = doc(db, "content", "portfolioData");
            unsubscribe = onSnapshot(docRef, async (docSnap) => {
                clearTimeout(safetyTimer); // Clear timeout on success
                try {
                    if (docSnap.exists()) {
                        console.log("✅ Data successfully fetched from Firestore!");
                        const cloudData = docSnap.data();
                        const cleanedCloudData = sanitizeData(cloudData);

                        // If Firestore stored old stock/AI images, purge them immediately
                        if (JSON.stringify(cloudData) !== JSON.stringify(cleanedCloudData)) {
                            console.log("🧹 Purging stock images from Firestore...");
                            setDoc(docRef, cleanedCloudData, { merge: true }).catch(err => console.warn("Auto-clean Firestore:", err));
                        }

                        // Conflict Resolution: Prefer the NEWER data
                        const localBackup = localStorage.getItem(STORAGE_KEY);
                        let localData = null;
                        if (localBackup) {
                            try { localData = JSON.parse(localBackup); } catch { /* ignore */ }
                        }

                        // Determine timestamp priority
                        const cloudTime = cleanedCloudData.lastModified || 0;
                        const localTime = localData?.lastModified || 0;

                        if (cloudTime > localTime) {
                            console.log("☁️ Cloud is newer. Updating app.");
                            setData(prev => sanitizeData({ ...prev, ...cleanedCloudData }));
                            localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizeData({ ...data, ...cleanedCloudData })));
                        } else if (localTime > cloudTime) {
                            console.warn("💾 Local is newer. Ignoring stale cloud data (pending sync).");
                            if (localData) setData(sanitizeData(localData));
                            showToast('Using Newer Local Data (Cloud Sync Pending)', 'info');
                        } else {
                            setData(prev => sanitizeData({ ...prev, ...cleanedCloudData }));
                        }
                    } else {
                        console.log("⚠️ Document missing. Checking Local Backup...");
                        const localBackup = localStorage.getItem(STORAGE_KEY);

                        if (localBackup) {
                            console.log("Found Local Backup - Restoring...");
                            const parsed = JSON.parse(localBackup);
                            setData(sanitizeData(parsed));
                            showToast('Restored Data from Local Backup', 'success');
                        } else {
                            console.log("No backup found. Using defaults.");
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
