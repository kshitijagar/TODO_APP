import React, { useEffect, useState } from "react";
import { Plus, Search, Calendar, Filter, CheckCircle2, Circle, Trash2, Edit3, Save, X } from "lucide-react";


function TodoForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    setIsAdding(true);
    await onAdd(title);
    setTitle("");
    setIsAdding(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <input
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="What needs to be done?"
            disabled={isAdding}
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={!title.trim() || isAdding}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
        >
          {isAdding ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <Plus className="w-5 h-5" />
          )}
          Add Todo
        </button>
      </div>
    </div>
  );
}

function TodoList({ todos, onToggle, onDelete, onEdit }) {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const handleEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.todo);
  };

  const handleSave = (id) => {
    if (editText.trim()) {
      onEdit(id, editText.trim());
    }
    setEditingId(null);
    setEditText("");
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleKeyPress = (e, id) => {
    if (e.key === 'Enter') {
      handleSave(id);
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (todos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📝</div>
        <p className="text-gray-500 text-lg">No todos found</p>
        <p className="text-gray-400 text-sm mt-2">Create your first todo to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="divide-y divide-gray-100">
        {todos.map((todo, index) => (
          <div
            key={todo.id}
            className={`p-6 hover:bg-gray-50 transition-all duration-200 ${
              todo.completed ? 'bg-gray-50' : ''
            }`}
            style={{
              animation: `slideIn 0.3s ease-out ${index * 0.1}s both`
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <button
                  onClick={() => onToggle(todo.id)}
                  className={`w-6 h-6 rounded-full transition-all duration-200 flex items-center justify-center ${
                    todo.completed
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'border-2 border-gray-300 hover:border-green-400'
                  }`}
                >
                  {todo.completed ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                </button>
                
                <div className="flex-1">
                  {editingId === todo.id ? (
                    <div className="flex gap-2">
                      <input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => handleKeyPress(e, todo.id)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSave(todo.id)}
                        className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <span
                        className={`text-lg ${
                          todo.completed
                            ? 'line-through text-gray-500'
                            : 'text-gray-800'
                        }`}
                      >
                        {todo.todo}
                      </span>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(todo.date).toLocaleDateString()}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          todo.completed
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {todo.completed ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {editingId !== todo.id && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(todo)}
                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(todo.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Pagination({ total, perPage, current, setPage }) {
  const pages = Math.ceil(total / perPage);
  
  if (pages <= 1) return null;

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, current - delta); i <= Math.min(pages - 1, current + delta); i++) {
      range.push(i);
    }

    if (current - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (current + delta < pages - 1) {
      rangeWithDots.push('...', pages);
    } else {
      rangeWithDots.push(pages);
    }

    return rangeWithDots;
  };

  return (
    <div className="flex justify-center mt-8">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setPage(current - 1)}
          disabled={current === 1}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
        >
          Previous
        </button>
        
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && setPage(page)}
            disabled={page === '...'}
            className={`px-4 py-2 rounded-lg transition-all duration-200 shadow-sm ${
              page === current
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                : page === '...'
                ? 'bg-white border border-gray-300 cursor-default'
                : 'bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => setPage(current + 1)}
          disabled={current === pages}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function Stats({ todos }) {
  const completed = todos.filter(todo => todo.completed).length;
  const pending = todos.length - completed;
  const completionRate = todos.length > 0 ? Math.round((completed / todos.length) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
        <div className="text-3xl font-bold">{todos.length}</div>
        <div className="text-blue-100 text-sm">Total Tasks</div>
      </div>
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
        <div className="text-3xl font-bold">{completed}</div>
        <div className="text-green-100 text-sm">Completed</div>
      </div>
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
        <div className="text-3xl font-bold">{pending}</div>
        <div className="text-orange-100 text-sm">Pending</div>
      </div>
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
        <div className="text-3xl font-bold">{completionRate}%</div>
        <div className="text-purple-100 text-sm">Completion Rate</div>
      </div>
    </div>
  );
}


export default function App() {
  const [todos, setTodos] = useState([]);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const todosPerPage = 10;

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const sampleTodos = [
        { id: 1, todo: "Learn React hooks", completed: false, date: "2024-07-15" },
        { id: 2, todo: "Build a todo app", completed: true, date: "2024-07-14" },
        { id: 3, todo: "Master JavaScript", completed: false, date: "2024-07-13" },
        { id: 4, todo: "Study algorithms", completed: true, date: "2024-07-12" },
        { id: 5, todo: "Practice coding", completed: false, date: "2024-07-11" },
        { id: 6, todo: "Read documentation", completed: false, date: "2024-07-10" },
        { id: 7, todo: "Write tests", completed: true, date: "2024-07-09" },
        { id: 8, todo: "Deploy application", completed: false, date: "2024-07-08" },
        { id: 9, todo: "Review code", completed: true, date: "2024-07-07" },
        { id: 10, todo: "Optimize performance", completed: false, date: "2024-07-06" },
        { id: 11, todo: "Fix bugs", completed: true, date: "2024-07-05" },
        { id: 12, todo: "Update dependencies", completed: false, date: "2024-07-04" },
      ];
      
      setTimeout(() => {
        setTodos(sampleTodos);
        setLoading(false);
      }, 1000);
    } catch (error) {
      alert("Failed to fetch todos");
      setLoading(false);
    }
  };

  const addTodo = async (title) => {
    const newTodo = {
      id: Math.max(...todos.map(t => t.id), 0) + 1,
      todo: title,
      completed: false,
      date: new Date().toISOString().slice(0, 10)
    };
    setTodos([newTodo, ...todos]);
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const editTodo = (id, newText) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, todo: newText } : todo
    ));
  };

  const filtered = todos.filter(todo => {
    const matchesSearch = todo.todo.toLowerCase().includes(search.toLowerCase());
    const matchesDate = (!fromDate || new Date(todo.date) >= new Date(fromDate)) &&
                       (!toDate || new Date(todo.date) <= new Date(toDate));
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "completed" && todo.completed) ||
                         (filterStatus === "pending" && !todo.completed);
    
    return matchesSearch && matchesDate && matchesStatus;
  });

  const last = currentPage * todosPerPage;
  const first = last - todosPerPage;
  const currentTodos = filtered.slice(first, last);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your todos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            ✨ Todo Masterpiece
          </h1>
          <p className="text-gray-600 text-lg">Organize your life with style and elegance</p>
        </div>

        <Stats todos={todos} />

     
        <TodoForm onAdd={addTodo} />

      
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <select
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Tasks</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
        <TodoList
          todos={currentTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onEdit={editTodo}
        />
        <Pagination
          total={filtered.length}
          perPage={todosPerPage}
          current={currentPage}
          setPage={setCurrentPage}
        />
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}