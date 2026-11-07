/**
 * Image sanitization helpers to ensure no stock or AI generated placeholder images
 * appear on the site or in SEO tags.
 */

export const isStockOrAiImage = (url) => {
    if (!url || typeof url !== 'string') return false;
    return (
        url.includes('unsplash.com') ||
        url.includes('1507003211169') ||
        url.includes('1555421689') ||
        url.includes('1571019614') ||
        url.includes('1507721999') ||
        url.includes('1599566150') ||
        url.includes('1677442136') ||
        url.includes('1620712943') ||
        url.includes('1555949963') ||
        url.includes('1498050108') ||
        url.includes('1675271591') ||
        url.includes('my-portfilo-sample-image.jpg')
    );
};

export const sanitizeData = (raw) => {
    if (!raw) return raw;
    const cleaned = { ...raw };
    if (cleaned.hero && (!cleaned.hero.image || isStockOrAiImage(cleaned.hero.image))) {
        cleaned.hero = { ...cleaned.hero, image: '/uday-portrait.png' };
    }
    if (cleaned.about && (!cleaned.about.image || isStockOrAiImage(cleaned.about.image))) {
        cleaned.about = { ...cleaned.about, image: '/uday-portrait.png' };
    }
    if (Array.isArray(cleaned.projects)) {
        cleaned.projects = cleaned.projects.map(p => {
            const validImg = (!p.image || isStockOrAiImage(p.image)) ? '/uday-portrait.png' : p.image;
            return {
                ...p,
                image: validImg,
                imageBefore: (!p.imageBefore || isStockOrAiImage(p.imageBefore)) ? validImg : p.imageBefore,
                imageAfter: (!p.imageAfter || isStockOrAiImage(p.imageAfter)) ? validImg : p.imageAfter,
            };
        });
    }
    if (Array.isArray(cleaned.blog)) {
        cleaned.blog = cleaned.blog.map(b => {
            const validImg = (!b.image || isStockOrAiImage(b.image)) ? '/uday-portrait.png' : b.image;
            const validImgs = Array.isArray(b.images) && b.images.length > 0
                ? b.images.map(img => (!img || isStockOrAiImage(img)) ? '/uday-portrait.png' : img)
                : [validImg];
            return {
                ...b,
                image: validImg,
                images: validImgs,
            };
        });
    }
    if (Array.isArray(cleaned.testimonials)) {
        cleaned.testimonials = cleaned.testimonials.map(t => ({
            ...t,
            avatar: (!t.avatar || isStockOrAiImage(t.avatar)) ? '/uday-portrait.png' : t.avatar,
        }));
    }
    return cleaned;
};
