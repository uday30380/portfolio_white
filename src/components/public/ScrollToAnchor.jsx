import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToAnchor = () => {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        // If there is a hash, scroll to the element
        if (hash) {
            // Wait slightly for any potential loading/render delays
            const timer = setTimeout(() => {
                const element = document.getElementById(hash.slice(1));
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);

            return () => clearTimeout(timer);
        } else {
            // No hash, standard scroll to top
            window.scrollTo(0, 0);
        }
    }, [pathname, hash]);

    return null;
};

export default ScrollToAnchor;
