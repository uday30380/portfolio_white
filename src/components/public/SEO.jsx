import React, { useEffect } from 'react';
import { useData } from '../../context/DataContext';

const SEO = () => {
    const { data } = useData();
    const { seoTitle, seoDescription } = data.settings || {};

    const updateMeta = (name, content) => {
        let element = document.querySelector(`meta[name="${name}"]`);
        if (!element) {
            element = document.createElement('meta');
            element.name = name;
            document.head.appendChild(element);
        }
        element.setAttribute('content', content);
    };

    const updateProperty = (property, content) => {
        let element = document.querySelector(`meta[property="${property}"]`);
        if (!element) {
            element = document.createElement('meta');
            element.setAttribute('property', property);
            document.head.appendChild(element);
        }
        element.setAttribute('content', content);
    };

    useEffect(() => {
        // Defaults
        const defaultTitle = "Uday Kiran Vempati | Web Developer Portfolio | Java & Firebase";
        const defaultDesc = "Uday Kiran Vempati is a Web Developer and Computer Science student at KL University. Skilled in Java, Firebase, Frontend Development, and Full Stack web applications.";

        const finalTitle = seoTitle || defaultTitle;
        const finalDesc = seoDescription || defaultDesc;

        // Document Title
        document.title = finalTitle;

        // Meta Description
        updateMeta('description', finalDesc);

        // Open Graph
        updateProperty('og:title', finalTitle);
        updateProperty('og:description', finalDesc);

        // JSON-LD Structured Data
        const schemaData = {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Vempati Uday Kiran",
            "url": "https://udaykiranportfolio.web.app",
            "image": data?.hero?.image || "",
            "jobTitle": "Web Developer & AI Innovator",
            "sameAs": [
                data?.contact?.linkedin,
                data?.contact?.github,
                data?.contact?.instagram
            ].filter(Boolean),
            "description": finalDesc
        };

        let script = document.querySelector('script[type="application/ld+json"]');
        if (!script) {
            script = document.createElement('script');
            script.type = "application/ld+json";
            document.head.appendChild(script);
        }
        script.textContent = JSON.stringify(schemaData);

    }, [seoTitle, seoDescription, data]);

    return null;
};

export default SEO;
