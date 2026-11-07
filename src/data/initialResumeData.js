/**
 * Seed data for Uday Kiran Vempati's Resume
 * Matches Section 6 specifications exactly.
 */

export const initialResumeData = {
    header: {
        name: "UDAY KIRAN VEMPATI",
        degreeLine: "B.Tech Computer Science & Engineering (3rd year), K L University, Vaddeswaram, AP",
        phone: "+91 81858 92753",
        email: "udaykiranvempati123@gmail.com",
        linkedin: "linkedin.com/in/udaykiran-vempati",
        github: "github.com/uday30380",
        portfolio: "udaykiranportfolio.web.app"
    },
    profile: "Computer Science student (CGPA 9.52) and full-stack web developer who builds and ships cloud-hosted products people actually use. Founder of SimpleTasks (400+ users, live on the Amazon Appstore). Looking to build responsive, fast web apps with React, JavaScript, Firebase and cloud platforms as a Web Developer Intern.",
    education: [
        {
            id: "edu-1",
            institution: "K L University (KLEF)",
            location: "Vaddeswaram",
            degree: "B.Tech, Computer Science & Engineering",
            startYear: "2024",
            endYear: "2028",
            endLabel: "(expected)",
            scoreLabel: "CGPA",
            score: "9.52 / 10",
            note: "(latest completed semester)",
            order: 1,
            visible: true
        },
        {
            id: "edu-2",
            institution: "Intermediate (Class XII)",
            location: "Andhra Pradesh",
            degree: "Board of Intermediate Education, Andhra Pradesh",
            startYear: "",
            endYear: "",
            endLabel: "",
            scoreLabel: "Score",
            score: "947 / 1000",
            note: "(94.7%)",
            order: 2,
            visible: true
        },
        {
            id: "edu-3",
            institution: "Class X",
            location: "Andhra Pradesh",
            degree: "AP SSC",
            startYear: "",
            endYear: "",
            endLabel: "",
            scoreLabel: "Score",
            score: "488 / 600",
            note: "(81.33%)",
            order: 3,
            visible: true
        }
    ],
    projects: [
        {
            id: "proj-1",
            title: "SimpleTasks – productivity web & mobile app",
            role: "founder, full-stack",
            techStack: "Firebase, JavaScript, Cloud Hosting, Amazon Appstore",
            dates: "2025 – present",
            link: "",
            bullets: [
                "Designed, built and launched a task and habit-tracking app with 400+ registered users; published on the Amazon Appstore.",
                "Built an admin dashboard tracking users and activity, and an automated daily engagement email pipeline to the full user base.",
                "Recognised by the Dean of Academics, K L University (Feb 2026)."
            ],
            order: 1,
            visible: true
        },
        {
            id: "proj-2",
            title: "Library Microservices System – cloud-deployed backend",
            role: "AWS",
            techStack: "Spring Boot, Eureka, API Gateway, JWT, Docker Compose, Terraform, AWS EC2",
            dates: "Nov 2026",
            link: "",
            bullets: [
                "Built a microservices library system with service discovery (Eureka) and a single API gateway.",
                "Secured APIs with JWT login and role-based access (admin and user).",
                "Containerised the services with Docker Compose and provisioned the AWS infrastructure with Terraform."
            ],
            order: 2,
            visible: true
        },
        {
            id: "proj-3",
            title: "klsamyak.in – SAMYAK 2026 university fest website",
            role: "co-developer",
            techStack: "Web design & development",
            dates: "2026",
            link: "https://klsamyak.in",
            bullets: [
                "Co-designed and developed the official fest website used for event registrations."
            ],
            order: 3,
            visible: true
        }
    ],
    experience: [
        {
            id: "exp-1",
            role: "President",
            organisation: "APRAMEYA – AI & Autonomous Systems Club, K L University",
            mode: "",
            dates: "2026 – present",
            bullets: [
                "Lead a 23-member club; coordinated the hands-on workshop \"Firebase Frenzy: Build & Deploy Live\" (Oct 2026)."
            ],
            order: 1,
            visible: true
        },
        {
            id: "exp-2",
            role: "Junior Graphic Designer",
            organisation: "Abhi Entertainment Studio",
            mode: "virtual",
            dates: "Nov 2025 – present",
            bullets: [
                "Create posters, thumbnails and brand visuals to tight deadlines; translate briefs into clear visual communication."
            ],
            order: 2,
            visible: true
        },
        {
            id: "exp-3",
            role: "Graphic Design Intern",
            organisation: "InAmigos Foundation",
            mode: "remote",
            dates: "",
            bullets: [
                "Designed awareness and outreach creatives for a non-profit."
            ],
            order: 3,
            visible: true
        }
    ],
    achievements: [
        {
            id: "ach-1",
            text: "Google Cloud skill badges: Store, Process & Manage Data on Google Cloud; Create Your First Gemini Enterprise Application; Develop AI-Powered Prototypes in Google AI Studio; Introduction to Large Language Models (Google Cloud: Learn with Communities, 2026).",
            order: 1,
            visible: true
        },
        {
            id: "ach-2",
            text: "Adobe University Hackathon 2026 – cleared Round 1 assessment, reached Round 2 (Case Study on Brand Visibility).",
            order: 2,
            visible: true
        },
        {
            id: "ach-3",
            text: "L'Oréal Sustainability Challenge 2026 – cleared the Sustainability Discovery Round with LoopLine, a changeover-loss reduction concept (IoT sensing, data dashboard and AI SKU-sequencing to cut product, water and energy loss on filling lines).",
            order: 3,
            visible: true
        }
    ],
    skills: [
        {
            id: "skill-1",
            label: "Programming",
            items: "Java, JavaScript, HTML/CSS",
            order: 1,
            visible: true
        },
        {
            id: "skill-2",
            label: "Web",
            items: "React, Vite, REST APIs, Git & GitHub, responsive UI",
            order: 2,
            visible: true
        },
        {
            id: "skill-3",
            label: "Cloud & DevOps",
            items: "Firebase, Google Cloud (Cloud Storage, Compute Engine, Cloud Functions, Pub/Sub), AWS (EC2, Docker deployment, Terraform), dashboards",
            order: 3,
            visible: true
        },
        {
            id: "skill-4",
            label: "AI",
            items: "Generative AI, Gemini, prompt design",
            order: 4,
            visible: true
        },
        {
            id: "skill-5",
            label: "Design",
            items: "Canva, Adobe tools, UI design",
            order: 5,
            visible: true
        },
        {
            id: "skill-6",
            label: "Strengths",
            items: "problem solving, leadership, communication, fast learner",
            order: 6,
            visible: true
        },
        {
            id: "skill-7",
            label: "Languages",
            items: "English, Telugu, learning Korean",
            order: 7,
            visible: true
        }
    ],
    sectionOrder: ["profile", "education", "projects", "experience", "achievements", "skills"],
    sectionVisible: {
        profile: true,
        education: true,
        projects: true,
        experience: true,
        achievements: true,
        skills: true
    },
    updatedAt: "February 2026"
};

