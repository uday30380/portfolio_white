import React from 'react';
import { useData } from '../../context/DataContext';
import { Quote, Star } from 'lucide-react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

const Testimonials = () => {
    const { data } = useData();

    return (
        <section id="testimonials" className="py-32 bg-[#0A0A0A] relative overflow-hidden">
            {/* Background Accent */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1.1, 1],
                    rotate: [0, 90, 180, 270, 360],
                    opacity: [0.3, 0.5, 0.4, 0.3]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-orange-500/10 to-transparent rounded-full blur-[150px] pointer-events-none -z-10"
            ></motion.div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center justify-center gap-3 mb-8"
                    >
                        <div className="w-10 h-[2px] bg-orange-500"></div>
                        <span className="text-sm font-bold tracking-[0.2em] text-orange-500 uppercase">Testimonials</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-5xl md:text-8xl font-black text-white leading-tight uppercase tracking-tighter"
                    >
                        Success <span className="text-orange-500 text-stroke inline-block origin-bottom hover:scale-110 transition-transform cursor-default">Stories</span>
                    </motion.h2>
                </div>

                <div className="max-w-5xl mx-auto">
                    {(data?.testimonials || []).map((testimonial, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.7, delay: idx * 0.2 }}
                            whileHover={{ y: -10, borderColor: "rgba(249, 115, 68, 0.3)" }}
                            key={testimonial.id}
                            className="bg-[#111111] p-12 md:p-24 rounded-[60px] border border-white/5 relative group overflow-hidden shadow-2xl hover:shadow-orange-500/10 transition-all duration-500"
                        >
                            {/* Decorative Quote Mark */}
                            <Quote className="absolute top-12 right-12 text-orange-500 opacity-10 group-hover:opacity-20 transition-opacity duration-700 transform group-hover:rotate-12" size={120} />
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/0 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                            <div className="relative z-10">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="flex gap-1 mb-10 text-orange-500"
                                >
                                    {[...Array(5)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.4 + (i * 0.05) }}
                                        >
                                            <Star size={16} fill="currentColor" />
                                        </motion.div>
                                    ))}
                                </motion.div>

                                <motion.p
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-2xl md:text-4xl font-bold text-white leading-[1.4] mb-16 tracking-tight group-hover:text-gray-100 transition-colors"
                                >
                                    "{testimonial.text}"
                                </motion.p>

                                <div className="flex flex-col md:flex-row md:items-center gap-8 pt-12 border-t border-white/5">
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        className="w-24 h-24 rounded-[32px] overflow-hidden shadow-2xl ring-4 ring-orange-500/10 group-hover:ring-orange-500/20 transition-all duration-500 aspect-square"
                                    >
                                        <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                                    </motion.div>
                                    <div className="space-y-2">
                                        <h4 className="text-2xl font-black text-white uppercase tracking-tighter">{testimonial.name}</h4>
                                        <p className="text-orange-500 font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-3">
                                            {testimonial.role}
                                            <span className="w-4 h-[1px] bg-white/20"></span>
                                            {testimonial.company}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
