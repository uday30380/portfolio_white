import React, { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion'; // eslint-disable-line no-unused-vars


const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
    useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const variants = {
        initial: { opacity: 0, y: 50, scale: 0.9 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 20, scale: 0.9, transition: { duration: 0.2 } }
    };

    const icons = {
        success: <CheckCircle size={20} className="text-green-500" />,
        error: <AlertCircle size={20} className="text-red-500" />,
        info: <Info size={20} className="text-blue-500" />,
        warning: <AlertTriangle size={20} className="text-yellow-500" />
    };

    const bgColors = {
        success: 'bg-green-500/10 border-green-500/20',
        error: 'bg-red-500/10 border-red-500/20',
        info: 'bg-blue-500/10 border-blue-500/20',
        warning: 'bg-yellow-500/10 border-yellow-500/20'
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] pointer-events-none">
            <AnimatePresence>
                <motion.div
                    layout
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={variants}
                    className={`pointer-events-auto flex items-start gap-4 p-4 rounded-xl border backdrop-blur-md shadow-xl max-w-sm w-full ${bgColors[type] || bgColors.success} bg-[#111111]`}
                >
                    <div className="mt-0.5 shrink-0">
                        {icons[type] || icons.success}
                    </div>
                    <div className="flex-1 pt-0.5">
                        <p className="text-sm font-semibold text-white leading-snug">{message}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors -mr-2 -mt-2 text-gray-400 hover:text-white"
                        aria-label="Close notification"
                    >
                        <X size={16} />
                    </button>

                    {/* Progress Bar */}
                    {duration > 0 && (
                        <motion.div
                            initial={{ width: "100%" }}
                            animate={{ width: "0%" }}
                            transition={{ duration: duration / 1000, ease: "linear" }}
                            className={`absolute bottom-0 left-4 right-4 h-[2px] rounded-full opacity-50 ${type === 'error' ? 'bg-red-500' : type === 'warning' ? 'bg-yellow-500' : type === 'info' ? 'bg-blue-500' : 'bg-green-500'}`}
                        />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Toast;
