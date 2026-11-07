import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, CheckCircle, Circle, Trash2, Layout } from 'lucide-react';

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
        <div className="bg-white rounded-[12px] border border-[#DDE7E5] p-6 shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-base font-semibold text-[#102A28] flex items-center gap-2">
                        <Layout className="text-[#102A28]" size={18} />
                        <span>Tasks</span>
                    </h3>
                    <p className="text-xs text-[#8A9B98]">To-do pipeline</p>
                </div>
                <div className="text-right">
                    <span className="text-xl font-semibold text-[#102A28]">
                        {progress}%
                    </span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-[#EEF4F3] rounded-full mb-6 overflow-hidden">
                <div
                    style={{ width: `${progress}%` }}
                    className="h-full bg-[#102A28] transition-all duration-300"
                />
            </div>

            {/* Input */}
            <form onSubmit={addTask} className="relative mb-6">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add a new task..."
                    className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] h-10 pl-3.5 pr-10 text-sm text-[#102A28] placeholder:text-[#8A9B98] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2] transition-colors"
                />
                <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 text-[#102A28] hover:bg-[#EEF4F3] rounded-[6px] transition-colors"
                >
                    <Plus size={16} />
                </button>
            </form>

            {/* Tasks List */}
            <div className="flex-1 overflow-y-auto space-y-2 max-h-[300px]">
                {tasks.length === 0 ? (
                    <p className="text-xs text-[#8A9B98] text-center py-6">No tasks yet</p>
                ) : (
                    tasks.map((task) => (
                        <div
                            key={task.id}
                            className={`flex items-center justify-between p-3 rounded-[8px] border transition-colors ${
                                task.completed
                                    ? 'bg-[#F7FAFA] border-[#DDE7E5] text-[#8A9B98]'
                                    : 'bg-white border-[#DDE7E5] text-[#102A28]'
                            }`}
                        >
                            <button
                                type="button"
                                onClick={() => toggleTask(task.id)}
                                className="flex items-center gap-2.5 text-left flex-1"
                            >
                                {task.completed ? (
                                    <CheckCircle size={16} className="text-[#15803D] shrink-0" />
                                ) : (
                                    <Circle size={16} className="text-[#8A9B98] shrink-0" />
                                )}
                                <span className={`text-xs ${task.completed ? 'line-through' : ''}`}>
                                    {task.text}
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => deleteTask(task.id)}
                                className="p-1 text-[#8A9B98] hover:text-[#DC2626] transition-colors"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminTodoList;
