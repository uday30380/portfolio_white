import React, { useState } from 'react';

import { Maximize2, Minimize2, Type, Volume2, VolumeX } from 'lucide-react';

const AccessibilityTools = () => {
    const [fontSize, setFontSize] = useState(100);
    const [speaking, setSpeaking] = useState(false);

    const increaseFontSize = () => {
        const newSize = Math.min(fontSize + 10, 150);
        setFontSize(newSize);
        document.documentElement.style.fontSize = `${newSize}%`;
    };

    const decreaseFontSize = () => {
        const newSize = Math.max(fontSize - 10, 80);
        setFontSize(newSize);
        document.documentElement.style.fontSize = `${newSize}%`;
    };

    const resetFontSize = () => {
        setFontSize(100);
        document.documentElement.style.fontSize = '100%';
    };

    const toggleTextToSpeech = () => {
        if (speaking) {
            window.speechSynthesis.cancel();
            setSpeaking(false);
        } else {
            const text = document.querySelector('.project-description')?.textContent || '';
            const utterance = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(utterance);
            setSpeaking(true);

            utterance.onend = () => setSpeaking(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            {/* Font Size Controls */}
            <div className="flex items-center gap-1 px-3 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
                <button
                    onClick={decreaseFontSize}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                    title="Decrease font size"
                >
                    <Minimize2 size={16} className="text-gray-400" />
                </button>
                <span className="text-xs font-bold text-gray-400 px-2">{fontSize}%</span>
                <button
                    onClick={increaseFontSize}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                    title="Increase font size"
                >
                    <Maximize2 size={16} className="text-gray-400" />
                </button>
                <button
                    onClick={resetFontSize}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors ml-1"
                    title="Reset font size"
                >
                    <Type size={16} className="text-gray-400" />
                </button>
            </div>

            {/* Text to Speech */}
            <button
                onClick={toggleTextToSpeech}
                className={`p-2.5 backdrop-blur-xl border rounded-xl transition-all ${speaking
                    ? 'bg-orange-500/20 border-orange-500/30'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                title={speaking ? 'Stop reading' : 'Read aloud'}
            >
                {speaking ? (
                    <VolumeX size={18} className="text-orange-400" />
                ) : (
                    <Volume2 size={18} className="text-gray-400" />
                )}
            </button>
        </div>
    );
};

export default AccessibilityTools;
