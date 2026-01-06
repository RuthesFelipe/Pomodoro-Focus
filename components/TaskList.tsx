
import React, { useState } from 'react';
import { Plus, Check, Trash2, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { Task } from '../types';
import { breakDownTask } from '../services/geminiService';
import { translations, Language } from '../translations';

interface TaskListProps {
  lang: Language;
}

export const TaskList: React.FC<TaskListProps> = ({ lang }) => {
  const t = translations[lang];
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: newTaskTitle,
      completed: false,
      subtasks: [],
    };
    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleBreakDown = async (id: string, title: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, isBreakingDown: true } : t));
    const steps = await breakDownTask(title, lang);
    setTasks(tasks.map(t => t.id === id ? { ...t, subtasks: steps, isBreakingDown: false } : t));
    setExpandedTasks(prev => new Set(prev).add(id));
  };

  const toggleExpand = (id: string) => {
    const next = new Set(expandedTasks);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedTasks(next);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-50">
        <h2 className="text-xl font-outfit font-bold text-slate-800 mb-4">{t.dailyFocus}</h2>
        <form onSubmit={addTask} className="relative">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder={t.taskPlaceholder}
            className="w-full px-5 py-3 rounded-2xl bg-slate-50 border-transparent focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-100 transition-all outline-none pr-12"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 p-1.5 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors"
          >
            <Plus size={20} />
          </button>
        </form>
      </div>

      <div className="max-h-[400px] overflow-y-auto p-4 space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-slate-400 text-sm">{t.noTasks}</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`group rounded-2xl border transition-all ${
                task.completed ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-200'
              }`}
            >
              <div className="p-4 flex items-center justify-between gap-3">
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'
                  }`}
                >
                  {task.completed && <Check size={14} strokeWidth={3} />}
                </button>
                
                <span className={`flex-grow text-sm font-medium ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                  {task.title}
                </span>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!task.completed && task.subtasks.length === 0 && (
                    <button
                      onClick={() => handleBreakDown(task.id, task.title)}
                      disabled={task.isBreakingDown}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      title={t.breakDownAI}
                    >
                      {task.isBreakingDown ? (
                        <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Sparkles size={18} />
                      )}
                    </button>
                  )}
                  {task.subtasks.length > 0 && (
                    <button
                      onClick={() => toggleExpand(task.id)}
                      className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg"
                    >
                      {expandedTasks.has(task.id) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  )}
                  <button onClick={() => deleteTask(task.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {expandedTasks.has(task.id) && task.subtasks.length > 0 && (
                <div className="px-12 pb-4 space-y-2">
                  {task.subtasks.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-500 py-1 border-l-2 border-slate-100 pl-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      {step}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
