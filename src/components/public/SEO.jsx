import React, { useEffect } from 'react';
import { useData } from '../../context/DataContext';

const BASE_URL = 'https://udaykiranportfolio.web.app';
const PERSON_NAME = 'Vempati Uday Kiran';
const FALLBACK_IMAGE = `${BASE_URL}/uday-portrait.png`;

/**
 * SEO Component – Injects rich structured data (JSON-LD) and meta tags.
 *
 * Structured data injected:
 *  1. Person       – Name, photo, job, social links (→ Google Knowledge Panel)
 *  2. WebSite      – Enables Google Sitelinks search box
 *  3. ImageObject  – Hero portrait (→ Google Images)
 *  4. ImageObject  – Every certificate/honor image (→ Google Images)
 *  5. ImageObject  – Every B.Tech journey image (→ Google Images)
 *  6. VideoObject  – Every journey video (→ Google Videos)
 *  7. ItemList     – List of all certificates (→ Rich Results)
 */
const SEO = ({ pageTitle, pageDescription, pageImage, pageUrl, extraSchemas = [] }) => {
    const { data } = useData();
    const { seoTitle, seoDescription } = data?.settings || {};

    // ─── Helpers ─────────────────────────────────────────────────────────────
    const setMeta = (name, content) => {
        if (!content) return;
        let el = document.querySelector(`meta[name="${name}"]`);
        if (!el) { el = document.createElement('meta'); el.name = name; document.head.appendChild(el); }
        el.setAttribute('content', content);
    };

    const setProp = (property, content) => {
        if (!content) return;
        let el = document.querySelector(`meta[property="${property}"]`);
        if (!el) { el = document.createElement('meta'); el.setAttribute('property', property); document.head.appendChild(el); }
        el.setAttribute('content', content);
    };

    const setLink = (rel, href) => {
        if (!href) return;
        let el = document.querySelector(`link[rel="${rel}"]`);
        if (!el) {
            el = document.createElement('link');
            el.setAttribute('rel', rel);
            document.head.appendChild(el);
        }
        el.setAttribute('href', href);
    };

    const setScript = (id, obj) => {
        let el = document.querySelector(`script[data-schema="${id}"]`);
        if (!el) {
            el = document.createElement('script');
            el.type = 'application/ld+json';
            el.setAttribute('data-schema', id);
            document.head.appendChild(el);
        }
        el.textContent = JSON.stringify(obj, null, 0);
    };

    // ─── Effect ──────────────────────────────────────────────────────────────
    useEffect(() => {
        const hero = data?.hero || {};
        const contact = data?.contact || {};
        const certificates = data?.certificates || [];
        const honors = data?.honors || [];
        const journeyItems = data?.journey || data?.btechJourney || [];

        let heroImage = FALLBACK_IMAGE;
        const isStockUrl = (u) => !u || typeof u !== 'string' || u.includes('unsplash.com') || u.includes('1507003211169') || u.includes('1555421689') || u.includes('1571019614');
        if (hero.image && !isStockUrl(hero.image)) {
            heroImage = hero.image.startsWith('http')
                ? hero.image
                : `${BASE_URL}${hero.image.startsWith('/') ? '' : '/'}${hero.image}`;
        }

        const defaultTitle = seoTitle || 'Uday Kiran Vempati | Web Developer & Designer | KL University';
        const defaultDesc = seoDescription || 'Uday Kiran Vempati – RPA Club Designer, Web Administrator, Provision Wing Lead at KL University. Published on Amazon App Store, recognized by Canva. Java, Firebase, Full Stack Developer.';

        const currentPath = typeof window !== 'undefined' && window.location.pathname !== '/' ? window.location.pathname : '';
        const finalTitle = pageTitle || defaultTitle;
        const finalDesc = pageDescription || defaultDesc;
        const finalImage = (!isStockUrl(pageImage) ? pageImage : null) || heroImage || FALLBACK_IMAGE;
        const finalUrl = pageUrl || `${BASE_URL}${currentPath}`;

        // ── Document title & basic meta ──────────────────────────────────────
        document.title = finalTitle;
        setMeta('description', finalDesc);
        setMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
        setLink('canonical', finalUrl);

        // ── Open Graph ───────────────────────────────────────────────────────
        setProp('og:title', finalTitle);
        setProp('og:description', finalDesc);
        setProp('og:image', finalImage);
        setProp('og:image:alt', `${PERSON_NAME} – Web Developer and Designer`);
        setProp('og:url', finalUrl);

        // ── Twitter ──────────────────────────────────────────────────────────
        setProp('twitter:title', finalTitle);
        setProp('twitter:description', finalDesc);
        setProp('twitter:image', finalImage);

        // ════════════════════════════════════════════════════════════════════
        // 1. PERSON SCHEMA – Makes your name/photo appear in Google Search
        // ════════════════════════════════════════════════════════════════════
        const personSchema = {
            '@context': 'https://schema.org',
            '@type': 'Person',
            '@id': `${BASE_URL}/#person`,
            name: PERSON_NAME,
            alternateName: ['Uday Kiran Vempati', 'Vempati Uday Kiran', 'Uday Kiran'],
            url: BASE_URL,
            image: {
                '@type': 'ImageObject',
                '@id': `${BASE_URL}/#personImage`,
                url: heroImage,
                contentUrl: heroImage,
                name: `${PERSON_NAME} – Professional Photo`,
                description: `Official portrait photo of ${PERSON_NAME}, RPA Club Designer and Web Administrator at KL University`,
                representativeOfPage: true,
                inLanguage: 'en-IN',
            },
            jobTitle: [
                'RPA Club Designer',
                'Web Administrator',
                'Provision Wing Lead',
                'Full Stack Developer',
                'Graphic Designer',
            ],
            worksFor: {
                '@type': 'Organization',
                name: 'KL University',
                url: 'https://www.kluniversity.in',
            },
            alumniOf: {
                '@type': 'CollegeOrUniversity',
                name: 'KL University',
                url: 'https://www.kluniversity.in',
            },
            description: defaultDesc,
            nationality: 'Indian',
            knowsAbout: [
                'Java Development', 'Firebase', 'Firestore', 'React', 'Full Stack Development',
                'Graphic Design', 'UI/UX Design', 'Canva', 'Amazon App Store', 'Entrepreneurship',
                'Web Administration', 'RPA (Robotic Process Automation)'
            ],
            sameAs: [
                contact?.linkedin,
                contact?.github,
                contact?.instagram,
                contact?.twitter,
                'https://www.linkedin.com/in/uday-kiran-vempati',
            ].filter(Boolean),
        };
        setScript('person', personSchema);

        // ════════════════════════════════════════════════════════════════════
        // 2. WEBSITE SCHEMA
        // ════════════════════════════════════════════════════════════════════
        const websiteSchema = {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            '@id': `${BASE_URL}/#website`,
            url: BASE_URL,
            name: `${PERSON_NAME} – Portfolio`,
            description: defaultDesc,
            author: { '@id': `${BASE_URL}/#person` },
            inLanguage: 'en-IN',
            potentialAction: {
                '@type': 'SearchAction',
                target: { '@type': 'EntryPoint', urlTemplate: `${BASE_URL}/blog?q={search_term_string}` },
                'query-input': 'required name=search_term_string',
            },
        };
        setScript('website', websiteSchema);

        // ════════════════════════════════════════════════════════════════════
        // 3. CERTIFICATE / HONOR IMAGE SCHEMAS (→ Google Images)
        // ════════════════════════════════════════════════════════════════════
        const allCerts = [
            ...certificates.map(c => ({ ...c, _type: 'certificate' })),
            ...honors.map(h => ({ ...h, _type: 'honor' })),
        ];

        if (allCerts.length > 0) {
            const certImageSchemas = allCerts
                .filter(c => c.image)
                .map((c, i) => ({
                    '@context': 'https://schema.org',
                    '@type': 'ImageObject',
                    '@id': `${BASE_URL}/#cert-image-${c.id || i}`,
                    url: c.image,
                    contentUrl: c.image,
                    name: `${c.title || 'Certificate'} – ${PERSON_NAME}`,
                    description: `${c.title || 'Certificate'} awarded by ${c.issuer || 'an organization'} to ${PERSON_NAME}`,
                    creditText: c.issuer || '',
                    creator: { '@type': 'Organization', name: c.issuer || '' },
                    copyrightNotice: c.issuer || PERSON_NAME,
                    license: 'https://creativecommons.org/licenses/by/4.0/',
                    acquireLicensePage: `${BASE_URL}/honors`,
                    representativeOfPage: false,
                    inLanguage: 'en-IN',
                    about: { '@id': `${BASE_URL}/#person` },
                }));

            // Also build EducationalOccupationalCredential items for the ItemList
            const credentialList = {
                '@context': 'https://schema.org',
                '@type': 'ItemList',
                '@id': `${BASE_URL}/#certifications`,
                name: `Certifications and Honors of ${PERSON_NAME}`,
                description: `A complete list of professional certifications, awards and honors earned by ${PERSON_NAME}`,
                url: `${BASE_URL}/honors`,
                numberOfItems: allCerts.length,
                itemListElement: allCerts.map((c, i) => ({
                    '@type': 'ListItem',
                    position: i + 1,
                    item: {
                        '@type': 'EducationalOccupationalCredential',
                        '@id': `${BASE_URL}/honors/${c.id || i}`,
                        name: c.title || 'Certificate',
                        url: `${BASE_URL}/honors/${c.id || i}`,
                        image: c.image || undefined,
                        description: c.description || `${c.title} from ${c.issuer}`,
                        dateCreated: c.date || undefined,
                        credentialCategory: c.category || 'Certification',
                        recognizedBy: { '@type': 'Organization', name: c.issuer || '' },
                        about: { '@id': `${BASE_URL}/#person` },
                    },
                })),
            };

            setScript('cert-images', { '@context': 'https://schema.org', '@graph': certImageSchemas });
            setScript('cert-list', credentialList);
        }

        // ════════════════════════════════════════════════════════════════════
        // 4. JOURNEY IMAGE + VIDEO SCHEMAS (→ Google Images & Videos)
        // ════════════════════════════════════════════════════════════════════
        if (journeyItems.length > 0) {
            const imageSchemas = [];
            const videoSchemas = [];

            journeyItems.forEach((item, i) => {
                const isYouTube = item.url && (item.url.includes('youtube.com') || item.url.includes('youtu.be'));
                const isInstagram = item.url && item.url.includes('instagram.com');
                const isLocalVideo = item.url && (
                    item.url.match(/\.(mp4|webm|ogg|mov)$/i) ||
                    item.type === 'local-video'
                );
                const isVideo = isYouTube || isInstagram || isLocalVideo || item.type === 'video';

                if (isVideo) {
                    // Extract YouTube ID for thumbnail
                    let ytId = null;
                    if (isYouTube) {
                        const m = item.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/);
                        ytId = m ? m[1] : null;
                    }
                    const thumbnail = item.thumbnail || item.image ||
                        (ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : FALLBACK_IMAGE);

                    const videoSchema = {
                        '@context': 'https://schema.org',
                        '@type': 'VideoObject',
                        '@id': `${BASE_URL}/#journey-video-${i}`,
                        name: item.caption || item.title || `${PERSON_NAME} – B.Tech Journey Video`,
                        description: item.description || item.caption ||
                            `Video from the B.Tech journey of ${PERSON_NAME} at KL University`,
                        thumbnailUrl: thumbnail,
                        uploadDate: item.date || '2024-01-01',
                        contentUrl: isLocalVideo ? (item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`) : undefined,
                        embedUrl: isYouTube && ytId ? `https://www.youtube.com/embed/${ytId}` : undefined,
                        author: { '@id': `${BASE_URL}/#person` },
                        publisher: { '@id': `${BASE_URL}/#person` },
                        inLanguage: 'en-IN',
                        keywords: `Uday Kiran Vempati, KL University, B.Tech Journey, ${item.caption || ''}`,
                    };
                    videoSchemas.push(videoSchema);
                } else if (item.url || item.image) {
                    const imgUrl = item.url || item.image;
                    const imgSchema = {
                        '@context': 'https://schema.org',
                        '@type': 'ImageObject',
                        '@id': `${BASE_URL}/#journey-image-${i}`,
                        url: imgUrl,
                        contentUrl: imgUrl,
                        name: item.caption || item.title || `${PERSON_NAME} – B.Tech Journey`,
                        description: item.description || item.caption ||
                            `Photo from the B.Tech journey of ${PERSON_NAME} at KL University`,
                        creditText: PERSON_NAME,
                        creator: { '@id': `${BASE_URL}/#person` },
                        about: { '@id': `${BASE_URL}/#person` },
                        inLanguage: 'en-IN',
                    };
                    imageSchemas.push(imgSchema);
                }
            });

            if (imageSchemas.length > 0)
                setScript('journey-images', { '@context': 'https://schema.org', '@graph': imageSchemas });
            if (videoSchemas.length > 0)
                setScript('journey-videos', { '@context': 'https://schema.org', '@graph': videoSchemas });
        }

        // ════════════════════════════════════════════════════════════════════
        // 5. EXTRA SCHEMAS (passed as prop by page-specific components)
        // ════════════════════════════════════════════════════════════════════
        if (extraSchemas.length > 0) {
            setScript('page-extras', { '@context': 'https://schema.org', '@graph': extraSchemas });
        }

    }, [data, seoTitle, seoDescription, pageTitle, pageDescription, pageImage, pageUrl, extraSchemas]);

    return null;
};

export default SEO;
