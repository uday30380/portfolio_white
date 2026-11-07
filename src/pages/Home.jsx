import React, { useEffect } from 'react';
import Navbar from '../components/public/Navbar';
import Hero from '../components/public/Hero';
import Projects from '../components/public/Projects';
import About from '../components/public/About';
import Skills from '../components/public/Skills';
import Certificates from '../components/public/Certificates';
import Testimonials from '../components/public/Testimonials';
import Contact from '../components/public/Contact';
import Footer from '../components/public/Footer';
import ScrollReveal from '../components/public/ScrollReveal';
import SEO from '../components/public/SEO';
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
                    console.warn("Visitor stats unavailable (offline or permission):", error?.message || error);
                }
            }
        };

        incrementVisitors();
    }, []);

    return (
        <main className="min-h-screen bg-[#F7FAFA] text-[#102A28]">
            <SEO />
            <Navbar />
            <Hero />
            <ScrollReveal><Projects /></ScrollReveal>
            <ScrollReveal><About /></ScrollReveal>
            <ScrollReveal><Skills /></ScrollReveal>
            <ScrollReveal><Certificates /></ScrollReveal>
            <ScrollReveal><Testimonials /></ScrollReveal>
            <ScrollReveal><Contact /></ScrollReveal>
            <Footer />
        </main>
    );
};

export default Home;
