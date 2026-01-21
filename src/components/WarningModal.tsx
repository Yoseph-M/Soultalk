import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ArrowRight, User, FileText, X } from 'lucide-react';

interface WarningModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    missingItems: string[];
    actionLabel: string;
    onAction: () => void;
}

const WarningModal: React.FC<WarningModalProps> = ({
    isOpen,
    onClose,
    title,
    message,
    missingItems,
    actionLabel,
    onAction
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                    />

                    {/* Modal Card */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700"
                    >
                        {/* Decorative Top Pattern */}
                        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-[#25A8A0]/20 to-teal-500/5 pointer-events-none" />

                        <div className="p-8 relative">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>

                            {/* Icon Header */}
                            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-orange-200/50 dark:border-orange-500/20">
                                <AlertCircle className="w-8 h-8 text-orange-500" />
                            </div>

                            {/* Content */}
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                                {title}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 font-medium">
                                {message}
                            </p>

                            {/* Missing Requirements List */}
                            <div className="space-y-3 mb-8">
                                {missingItems.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-600 transition-all hover:border-[#25A8A0]/30"
                                    >
                                        <div className="w-8 h-8 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
                                            {item.toLowerCase().includes('photo') || item.toLowerCase().includes('avatar') ? (
                                                <User className="w-4 h-4 text-[#25A8A0]" />
                                            ) : (
                                                <FileText className="w-4 h-4 text-[#25A8A0]" />
                                            )}
                                        </div>
                                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                            Missing {item}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={onAction}
                                className="w-full flex items-center justify-center gap-2 py-4 bg-[#25A8A0] text-white font-black rounded-2xl shadow-lg shadow-teal-500/20 hover:scale-[1.02] active:scale-95 transition-all group"
                            >
                                <span>{actionLabel}</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <p className="text-center mt-6 text-[10px] uppercase tracking-widest font-black text-gray-400">
                                Secure & Mandatory Update
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default WarningModal;
