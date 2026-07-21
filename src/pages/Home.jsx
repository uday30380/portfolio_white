import React, { useEffect } from 'react';
import Navbar from '../components/public/Navbar';
import Hero from '../components/public/Hero';
import About from '../components/public/About';
import Skills from '../components/public/Skills';
import Projects from '../components/public/Projects';
import Certificates from '../components/public/Certificates';
import Achievements from '../components/public/Achievements';
import Contact from '../components/public/Contact';
import Footer from '../components/public/Footer';
import ScrollReveal from '../components/public/ScrollReveal';
import PageWrapper from '../components/public/PageWrapper';
import Testimonials from '../components/public/Testimonials';
import { db } from '../firebase';
import { doc, updateDoc, increment, getDoc, setDoc } from 'firebase/firestore';

const Home = () => {
    useEffect(() => {
        const incrementVisitors = async () => {
            const hasVisited = sessionStorage.getItem('visited');
            if (!hasVisited) {
                try {
                    const statsRef = doc(db, 'stats', 'general');
                    const docSnap = await getDoc(statsRef);

                    if (docSnap.exists()) {
                        await updateDoc(statsRef, {
                            totalVisitors: increment(1)
                        });
                    } else {
                        await setDoc(statsRef, {
                            totalVisitors: 1
                        });
                    }
                    sessionStorage.setItem('visited', 'true');
                } catch (error) {
                    console.error("Error updating visitor count:", error);
                }
            }
        };

        incrementVisitors();
    }, []);

    return (
        <PageWrapper>
            <div className="bg-dark min-h-screen">
                <Navbar />
                <Hero />
                <ScrollReveal><About /></ScrollReveal>
                <ScrollReveal><Skills /></ScrollReveal>
                <ScrollReveal><Projects /></ScrollReveal>
                <ScrollReveal><Certificates /></ScrollReveal>
                <ScrollReveal><Achievements /></ScrollReveal>
                <ScrollReveal><Testimonials /></ScrollReveal>
                <ScrollReveal><Contact /></ScrollReveal>
                <ScrollReveal><Footer /></ScrollReveal>
            </div>
        </PageWrapper>
    );
};

export default Home;
