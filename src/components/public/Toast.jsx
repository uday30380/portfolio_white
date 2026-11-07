import React, { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

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
        initial: { opacity: 0, y: 50, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } }
    };

    const icons = {
        success: <CheckCircle size={20} className="text-[#15803D]" />,
        error: <AlertCircle size={20} className="text-[#DC2626]" />,
        info: <Info size={20} className="text-[#0F766E]" />,
        warning: <AlertTriangle size={20} className="text-[#B45309]" />
    };

    const styles = {
        success: 'bg-white border-[#DDE7E5] text-[#102A28]',
        error: 'bg-[#FEF2F2] border-[#FCA5A5] text-[#102A28]',
        info: 'bg-[#E6F4F2] border-[#DDE7E5] text-[#102A28]',
        warning: 'bg-[#FFFBEB] border-[#FDE68A] text-[#102A28]'
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
                    className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg max-w-sm w-full ${styles[type] || styles.success}`}
                >
                    <div className="mt-0.5 shrink-0">
                        {icons[type] || icons.success}
                    </div>
                    <div className="flex-1 pt-0.5">
                        <p className="text-sm font-medium leading-snug">{message}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-[#EEF4F3] rounded-full transition-colors -mr-1 -mt-1 text-[#8A9B98] hover:text-[#102A28]"
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
                            className={`absolute bottom-0 left-4 right-4 h-[2px] rounded-full opacity-60 ${
                                type === 'error'
                                    ? 'bg-[#DC2626]'
                                    : type === 'warning'
                                    ? 'bg-[#B45309]'
                                    : 'bg-[#0F766E]'
                            }`}
                        />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Toast;
