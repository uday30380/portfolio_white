import React from 'react';
import { Linkedin, Github, Instagram, Youtube } from 'lucide-react';
import { useData } from '../../context/DataContext';

const Footer = () => {
    const { data } = useData() || {};

    const socialLinks = [
        {
            name: 'LinkedIn',
            url: data?.contact?.linkedin || 'https://www.linkedin.com/in/uday-kiran-vempati-9a9972288/',
            icon: Linkedin
        },
        {
            name: 'GitHub',
            url: data?.contact?.github || 'https://github.com/uday30380',
            icon: Github
        },
        {
            name: 'Instagram',
            url: data?.contact?.instagram || 'https://www.instagram.com/uday_kiran_30_/',
            icon: Instagram
        },
        {
            name: 'YouTube',
            url: 'https://youtube.com',
            icon: Youtube
        }
    ];

    return (
        <footer className="bg-[#EEF4F3] border-t border-[#DDE7E5] py-12">
            <div className="max-w-[1100px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                {/* Left: Name & Role */}
                <div>
                    <div className="text-base font-semibold text-[#102A28]">
                        Uday Kiran Vempati
                    </div>
                    <p className="text-sm text-[#4B5F5C] mt-0.5">
                        Full-stack developer and designer
                    </p>
                </div>

                {/* Center / Right: Social Icons */}
                <div className="flex items-center gap-4">
                    {socialLinks.map((item) => {
                        const Icon = item.icon;
                        return (
                            <a
                                key={item.name}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={item.name}
                                className="w-10 h-10 rounded-lg border border-[#DDE7E5] bg-[#FFFFFF] hover:bg-[#E6F4F2] text-[#4B5F5C] hover:text-[#0F766E] flex items-center justify-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7CC7BD]"
                            >
                                <Icon size={18} />
                            </a>
                        );
                    })}
                </div>

                {/* Right: Copyright */}
                <div className="text-xs text-[#8A9B98] sm:text-right">
                    © {new Date().getFullYear()} Uday Kiran Vempati. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;