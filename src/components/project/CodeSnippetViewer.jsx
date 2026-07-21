import React, { useState } from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Code, Copy, Check, Terminal } from 'lucide-react';

const CodeSnippetViewer = ({ snippets, title }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [copied, setCopied] = useState(false);

    // Fallback snippets for demo if none provided
    const displaySnippets = snippets && snippets.length > 0 ? snippets : [
        {
            language: 'javascript',
            filename: 'example.js',
            code: `// Sample code for ${title}\nfunction initializeProject() {\n  console.log("Project Initialized");\n  return true;\n}`
        }
    ];

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(displaySnippets[activeTab].code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-xl">
            {/* Header / Tabs */}
            <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/10">
                <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
                    {displaySnippets.map((snippet, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveTab(index)}
                            className={`flex items-center gap-2 py-2 transition-all relative ${activeTab === index ? 'text-orange-500' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <Terminal size={14} />
                            <span className="text-sm font-bold whitespace-nowrap">
                                {snippet.filename || snippet.language}
                            </span>
                            {activeTab === index && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute -bottom-4 left-0 right-0 h-[2px] bg-orange-500"
                                />
                            )}
                        </button>
                    ))}
                </div>
                <button
                    onClick={copyToClipboard}
                    className="p-2 hover:bg-white/10 rounded-lg transition-all text-gray-400 hover:text-white"
                    title="Copy Code"
                >
                    {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                </button>
            </div>

            {/* Code Content */}
            <div className="p-6 overflow-x-auto">
                <pre className="text-sm md:text-base font-mono leading-relaxed">
                    <code className="text-gray-300">
                        {displaySnippets[activeTab].code.split('\n').map((line, i) => (
                            <div key={i} className="flex gap-4 group">
                                <span className="text-gray-600 select-none text-right w-8">{i + 1}</span>
                                <span className="group-hover:text-white transition-colors">{line}</span>
                            </div>
                        ))}
                    </code>
                </pre>
            </div>

            {/* Language Badge */}
            <div className="px-6 py-3 bg-white/5 border-t border-white/10 flex justify-end">
                <div className="flex items-center gap-2">
                    <Code size={12} className="text-gray-500" />
                    <span className="text-xs font-black uppercase tracking-widest text-gray-500">
                        {displaySnippets[activeTab].language}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CodeSnippetViewer;
