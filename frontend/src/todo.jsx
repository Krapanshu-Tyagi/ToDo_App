
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  Circle,
  Search,
  Filter,
  LogOut,
  AlertCircle,
  Zap,
  Calendar,
  Flag,
  Tag,
} from 'lucide-react';
import { apiRequest } from './api/api.js';

export default function Todo() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('work');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [sortBy, setSortBy] = useState('date');

  const categories = ['work', 'personal', 'shopping', 'health'];
  const priorities = ['low', 'medium', 'high', 'urgent'];

  // Fetch todos on mount
  useEffect(() => {
    if (!localStorage.getItem("token")) {
    window.location.href = "/login";
    }
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const data = await apiRequest('/api/todos', { method: 'GET' });
      setTodos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching todos:', error);
      setTodos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const data = await apiRequest('/api/todos', {
        method: 'POST',
        body: JSON.stringify({
          text: newTodo,
          priority,
          category,
          dueDate,
          completed: false,
        }),
      });
      setTodos([...todos, data]);
      setNewTodo('');
      setDueDate('');
      setPriority('medium');
      setCategory('work');
    } catch (error) {
      alert('Error adding todo: ' + error.message);
    }
  };

  const toggleComplete = async (todo) => {
    try {
      const data = await apiRequest(`/api/todos/${todo._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ completed: !todo.completed }),
      });
      setTodos(todos.map((t) => (t._id === todo._id ? data : t)));
    } catch (error) {
      alert('Error updating todo: ' + error.message);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await apiRequest(`/api/todos/${id}`, { method: 'DELETE' });
      setTodos(todos.filter((t) => t._id !== id));
    } catch (error) {
      alert('Error deleting todo: ' + error.message);
    }
  };

  const updateTodo = async (id) => {
    try {
      const data = await apiRequest(`/api/todos/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ text: editText }),
      });
      setTodos(todos.map((t) => (t._id === id ? data : t)));
      setEditingId(null);
      setEditText('');
    } catch (error) {
      alert('Error updating todo: ' + error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  // Filter and sort todos
  const filteredTodos = todos
    .filter((todo) => {
      const matchesSearch = todo.text
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesPriority = filterPriority === 'all' || todo.priority === filterPriority;
      const matchesCategory = filterCategory === 'all' || todo.category === filterCategory;
      return matchesSearch && matchesPriority && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sortBy === 'completed') {
        return a.completed - b.completed;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const stats = {
    total: todos.length,
    completed: todos.filter((t) => t.completed).length,
    pending: todos.filter((t) => !t.completed).length,
    urgent: todos.filter((t) => t.priority === 'urgent' && !t.completed).length,
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-400 bg-red-500/20';
      case 'high':
        return 'text-orange-400 bg-orange-500/20';
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'low':
        return 'text-green-400 bg-green-500/20';
      default:
        return 'text-lunaLight bg-lunaLight/20';
    }
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'work':
        return 'bg-blue-500/20 text-blue-400';
      case 'personal':
        return 'bg-purple-500/20 text-purple-400';
      case 'shopping':
        return 'bg-pink-500/20 text-pink-400';
      case 'health':
        return 'bg-green-500/20 text-green-400';
      default:
        return 'bg-lunaLight/20 text-lunaLight';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lunaNavy via-lunaDark to-lunaNavy text-lunaLight relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #54ACBF 0%, transparent 70%)' }}
        animate={{ x: [0, 50, -30, 0], y: [0, -50, 30, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #54ACBF 0%, transparent 70%)' }}
        animate={{ x: [0, -50, 30, 0], y: [0, 50, -30, 0] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Grid background */}
      <div className="absolute inset-0 opacity-5">
        <div
          style={{
            backgroundImage:
              'linear-gradient(rgba(84, 172, 191, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(84, 172, 191, 0.5) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Main container */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Zap className="w-10 h-10 text-lunaMid" />
            </motion.div>
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-lunaLight to-lunaMid bg-clip-text text-transparent">
                TaskMind
              </h1>
              <p className="text-lunaLight/60 text-sm">Advanced Task Management</p>
            </div>
          </div>
          <motion.button
            onClick={logout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-400 hover:bg-red-500/30 transition-all"
          >
            <LogOut size={20} />
            Logout
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'Total Tasks', value: stats.total, icon: Circle, color: 'from-lunaLight to-lunaMid' },
            { label: 'Completed', value: stats.completed, icon: Check, color: 'from-green-400 to-emerald-500' },
            { label: 'Pending', value: stats.pending, icon: AlertCircle, color: 'from-yellow-400 to-orange-500' },
            { label: 'Urgent', value: stats.urgent, icon: Flag, color: 'from-red-400 to-rose-500' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              className="relative bg-white/5 backdrop-blur-xl border border-lunaLight/20 rounded-xl p-6 overflow-hidden group hover:border-lunaMid/50 transition-all"
              whileHover={{ scale: 1.05 }}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 transition-all`} />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-lunaLight/60 text-sm font-semibold">{stat.label}</p>
                  <p className="text-4xl font-bold text-lunaLight mt-2">{stat.value}</p>
                </div>
                <stat.icon className={`w-12 h-12 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent opacity-60`} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Add Todo Form */}
        <motion.div
          variants={itemVariants}
          className="relative bg-white/5 backdrop-blur-xl border border-lunaLight/20 rounded-2xl p-8 mb-8 hover:border-lunaMid/50 transition-all"
        >
          <motion.div
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-lunaMid/20 to-lunaBlue/20 blur-xl opacity-0 group-hover:opacity-100"
            transition={{ duration: 0.3 }}
          />
          <form onSubmit={addTodo} className="relative space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-lunaLight">
              <Plus className="text-lunaMid" size={28} />
              Add New Task
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Task input */}
              <div className="md:col-span-6">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="What's on your mind?"
                  className="w-full px-4 py-3 bg-white/5 border border-lunaLight/20 rounded-lg text-lunaLight placeholder-lunaLight/40 focus:outline-none focus:ring-2 focus:ring-lunaMid focus:border-transparent transition-all hover:bg-white/10"
                />
              </div>

              {/* Priority */}
              <div className="md:col-span-2">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-lunaLight/20 rounded-lg text-lunaLight focus:outline-none focus:ring-2 focus:ring-lunaMid focus:border-transparent transition-all cursor-pointer"
                >
                  {priorities.map((p) => (
                    <option key={p} value={p} className="bg-lunaDark">
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div className="md:col-span-2">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-lunaLight/20 rounded-lg text-lunaLight focus:outline-none focus:ring-2 focus:ring-lunaMid focus:border-transparent transition-all cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-lunaDark">
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Due Date */}
              <div className="md:col-span-2">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-lunaLight/20 rounded-lg text-lunaLight focus:outline-none focus:ring-2 focus:ring-lunaMid focus:border-transparent transition-all cursor-pointer"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-lunaMid to-lunaBlue hover:from-lunaMid/90 hover:to-lunaBlue/90 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add Task
            </motion.button>
          </form>
        </motion.div>

        {/* Filters */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row gap-4 mb-8 flex-wrap"
        >
          {/* Search */}
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-3 w-5 h-5 text-lunaLight/60 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-lunaLight/20 rounded-lg text-lunaLight placeholder-lunaLight/40 focus:outline-none focus:ring-2 focus:ring-lunaMid transition-all"
            />
          </div>

          {/* Filter Priority */}
          <div className="relative min-w-[150px]">
            <Filter className="absolute left-3 top-3 w-5 h-5 text-lunaLight/60 pointer-events-none" />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-lunaLight/20 rounded-lg text-lunaLight focus:outline-none focus:ring-2 focus:ring-lunaMid transition-all cursor-pointer appearance-none"
            >
              <option value="all" className="bg-lunaDark">
                All Priorities
              </option>
              {priorities.map((p) => (
                <option key={p} value={p} className="bg-lunaDark">
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Category */}
          <div className="relative min-w-[150px]">
            <Tag className="absolute left-3 top-3 w-5 h-5 text-lunaLight/60 pointer-events-none" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-lunaLight/20 rounded-lg text-lunaLight focus:outline-none focus:ring-2 focus:ring-lunaMid transition-all cursor-pointer appearance-none"
            >
              <option value="all" className="bg-lunaDark">
                All Categories
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-lunaDark">
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="relative min-w-[150px]">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-lunaLight/20 rounded-lg text-lunaLight focus:outline-none focus:ring-2 focus:ring-lunaMid transition-all cursor-pointer"
            >
              <option value="date" className="bg-lunaDark">
                Sort by Date
              </option>
              <option value="priority" className="bg-lunaDark">
                Sort by Priority
              </option>
              <option value="completed" className="bg-lunaDark">
                Sort by Status
              </option>
            </select>
          </div>
        </motion.div>

        {/* Todo List */}
        <motion.div
          variants={itemVariants}
          className="space-y-4"
        >
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 border-3 border-lunaLight/20 border-t-lunaMid rounded-full"
              />
            </div>
          ) : filteredTodos.length === 0 ? (
            <motion.div
              className="text-center py-16 bg-white/5 backdrop-blur-xl border border-lunaLight/20 rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Circle className="w-12 h-12 text-lunaLight/40 mx-auto mb-4" />
              <p className="text-lunaLight/60 text-lg font-semibold">No tasks yet</p>
              <p className="text-lunaLight/40 text-sm">Create your first task to get started!</p>
            </motion.div>
          ) : (
            <AnimatePresence>
              {filteredTodos.map((todo, idx) => (
                <motion.div
                  key={todo._id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  className={`group relative bg-white/5 backdrop-blur-xl border border-lunaLight/20 rounded-xl p-6 hover:border-lunaMid/50 transition-all cursor-pointer ${
                    todo.completed ? 'opacity-70' : ''
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <motion.button
                      onClick={() => toggleComplete(todo)}
                      className={`flex-shrink-0 mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        todo.completed
                          ? 'bg-lunaMid border-lunaMid'
                          : 'border-lunaLight/40 hover:border-lunaMid'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {todo.completed && <Check size={16} className="text-white" />}
                    </motion.button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {editingId === todo._id ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="flex-1 px-3 py-2 bg-white/10 border border-lunaMid rounded-lg text-lunaLight focus:outline-none focus:ring-2 focus:ring-lunaMid"
                            autoFocus
                          />
                          <motion.button
                            onClick={() => updateTodo(todo._id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-lunaMid hover:bg-lunaMid/80 text-white rounded-lg transition-all"
                          >
                            Save
                          </motion.button>
                        </div>
                      ) : (
                        <>
                          <p
                            className={`text-lg font-semibold transition-all ${
                              todo.completed
                                ? 'line-through text-lunaLight/50'
                                : 'text-lunaLight'
                            }`}
                          >
                            {todo.text}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {/* Priority Badge */}
                            <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 ${getPriorityColor(todo.priority)}`}>
                              <Flag size={14} />
                              {todo.priority}
                            </span>

                            {/* Category Badge */}
                            <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 ${getCategoryColor(todo.category)}`}>
                              <Tag size={14} />
                              {todo.category}
                            </span>

                            {/* Due Date */}
                            {todo.dueDate && (
                              <span className="text-xs font-bold px-3 py-1 rounded-full bg-lunaBlue/20 text-lunaLight flex items-center gap-1">
                                <Calendar size={14} />
                                {new Date(todo.dueDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Actions */}
                    {editingId !== todo._id && (
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <motion.button
                          onClick={() => {
                            setEditingId(todo._id);
                            setEditText(todo.text);
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 hover:bg-blue-500/20 rounded-lg text-blue-400 transition-all"
                        >
                          <Edit2 size={18} />
                        </motion.button>
                        <motion.button
                          onClick={() => deleteTodo(todo._id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-all"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>

        {/* Progress bar */}
        {stats.total > 0 && (
          <motion.div variants={itemVariants} className="mt-12">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold text-lunaLight">Overall Progress</span>
              <span className="text-sm font-bold text-lunaMid">
                {Math.round((stats.completed / stats.total) * 100)}%
              </span>
            </div>
            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-lunaLight/20">
              <motion.div
                className="h-full bg-gradient-to-r from-lunaMid to-lunaBlue rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(stats.completed / stats.total) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}