import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, CheckCircle, Circle, Trash2, Layout, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars

const AdminTodoList = () => {
    const { data, updateData } = useData();
    const tasks = data.adminTasks || [];
    const [newTask, setNewTask] = useState('');

    const addTask = async (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        const updatedTasks = [{ id: Date.now(), text: newTask, completed: false }, ...tasks];
        await updateData('adminTasks', updatedTasks);
        setNewTask('');
    };

    const toggleTask = async (id) => {
        const updatedTasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
        await updateData('adminTasks', updatedTasks);
    };

    const deleteTask = async (id) => {
        const updatedTasks = tasks.filter(t => t.id !== id);
        await updateData('adminTasks', updatedTasks);
    };

    const completedCount = tasks.filter(t => t.completed).length;
    const progress = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

    return (
        <div className="bg-[#111111] rounded-[40px] border border-white/5 p-10 h-full flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -ml-10 -mt-10 group-hover:scale-150 transition-transform duration-1000"></div>

            <div className="flex justify-between items-center mb-8 relative z-10">
                <div>
                    <h3 className="text-lg font-black uppercase tracking-widest text-white flex items-center gap-3">
                        <Layout className="text-orange-500" size={20} /> Tasks
                    </h3>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Personal Pipeline</p>
                </div>
                <div className="text-right">
                    <span className="text-3xl font-black text-white">
                        {progress}%
                    </span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-white/5 rounded-full mb-8 overflow-hidden relative z-10 font-sans">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-orange-500 shadow-[0_0_10px_rgba(255,125,68,0.5)]"
                />
            </div>

            {/* Input */}
            <form onSubmit={addTask} className="relative mb-8 z-10">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Capture new task..."
                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-6 pr-14 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold placeholder:text-gray-700"
                />
                <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-orange-500/10 text-orange-500 rounded-xl hover:bg-orange-500 hover:text-white transition-all shadow-lg active:scale-95"
                >
                    <Plus size={20} />
                </button>
            </form>

            {/* Task List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2 z-10">
                <AnimatePresence mode="popLayout">
                    {tasks.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <Calendar size={48} className="mx-auto text-gray-800 mb-4 opacity-20" />
                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Clear Horizons</p>
                        </motion.div>
                    ) : (
                        tasks.map(task => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                key={task.id}
                                className={`group flex items-center gap-4 p-5 rounded-[24px] border transition-all duration-300 ${task.completed ? 'bg-white/5 border-transparent opacity-40' : 'bg-[#0A0A0A] border-white/5 hover:border-orange-500/20 shadow-xl'}`}
                            >
                                <button
                                    onClick={() => toggleTask(task.id)}
                                    className={`flex-shrink-0 transition-colors ${task.completed ? 'text-green-500' : 'text-gray-600 hover:text-orange-500'}`}
                                >
                                    {task.completed ? <CheckCircle size={22} /> : <Circle size={22} />}
                                </button>
                                <span className={`flex-1 text-sm font-bold tracking-wide ${task.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                                    {task.text}
                                </span>
                                <button
                                    onClick={() => deleteTask(task.id)}
                                    className="opacity-0 group-hover:opacity-100 text-gray-700 hover:text-red-500 transition-all p-2 bg-white/5 rounded-lg"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdminTodoList;
