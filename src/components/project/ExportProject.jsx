import React from 'react';
import { motion } from 'framer-motion';
import { FileDown, Printer, FileText, Code } from 'lucide-react';

const ExportProject = ({ project, url }) => {
    const exportAsPDF = () => {
        // Simple print dialog for PDF export
        window.print();
    };

    const exportAsMarkdown = () => {
        const markdown = `# ${project.title}

${project.description}

## Tech Stack
${project.techUsed?.map(tech => `- ${tech}`).join('\n') || 'N/A'}

## The Challenge
${project.problem || 'N/A'}

## The Solution
${project.solution || 'N/A'}

## The Result
${project.outcome || 'N/A'}

## Links
${project.liveLink ? `- Live Demo: ${project.liveLink}` : ''}
${project.githubLink ? `- Source Code: ${project.githubLink}` : ''}
- Project Page: ${url}

---
*Generated from ${url}*
`;

        const blob = new Blob([markdown], { type: 'text/markdown' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${project.title.replace(/\s+/g, '-')}.md`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportAsJSON = () => {
        const jsonData = JSON.stringify(project, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${project.title.replace(/\s+/g, '-')}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportOptions = [
        {
            icon: Printer,
            label: 'Print / PDF',
            action: exportAsPDF,
            description: 'Print or save as PDF',
            color: 'text-[#4B5F5C] text-[#4B5F5C]'
        },
        {
            icon: FileText,
            label: 'Markdown',
            action: exportAsMarkdown,
            description: 'Download as .md file',
            color: 'from-purple-500 to-purple-600'
        },
        {
            icon: Code,
            label: 'JSON',
            action: exportAsJSON,
            description: 'Export project data',
            color: 'from-green-500 to-green-600'
        }
    ];

    return (
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <FileDown size={24} className="text-orange-500" />
                <h3 className="text-2xl font-black text-white uppercase tracking-wider">
                    Export Project
                </h3>
            </div>

            {/* Export Options */}
            <div className="grid md:grid-cols-3 gap-4">
                {exportOptions.map((option, index) => {
                    const Icon = option.icon;
                    return (
                        <motion.button
                            key={option.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={option.action}
                            className="group relative p-6 bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-2xl hover:border-white/20 transition-all text-left overflow-hidden"
                        >
                            {/* Background Gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>

                            {/* Icon */}
                            <div className={`w-12 h-12 bg-gradient-to-br ${option.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform relative z-10`}>
                                <Icon size={24} className="text-white" />
                            </div>

                            {/* Label */}
                            <h4 className="text-lg font-black text-white mb-2 relative z-10">
                                {option.label}
                            </h4>

                            {/* Description */}
                            <p className="text-sm text-gray-400 relative z-10">
                                {option.description}
                            </p>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};

export default ExportProject;

