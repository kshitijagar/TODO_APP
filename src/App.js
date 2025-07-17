import { useEffect, useState } from "react";
import axios from "axios";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import Pagination from "./components/Pagination";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const todosPerPage = 10;

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://dummyjson.com/todos");
      const enriched = res.data.todos.map(todo => ({
        ...todo,
        date: randomDate("2024-01-01", "2024-12-31")
      }));
      setTodos(enriched);
    } catch {
      alert("Failed to fetch todos");
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (title) => {
    try {
      const res = await axios.post("https://dummyjson.com/todos/add", {
        todo: title,
        completed: false,
        userId: 1
      });
      const newTodo = {
        ...res.data,
        date: new Date().toISOString().slice(0, 10)
      };
      setTodos([newTodo, ...todos]);
    } catch {
      alert("Failed to add todo");
    }
  };

  const filtered = todos.filter(todo =>
    todo.todo.toLowerCase().includes(search.toLowerCase()) &&
    (!fromDate || new Date(todo.date) >= new Date(fromDate)) &&
    (!toDate || new Date(todo.date) <= new Date(toDate))
  );

  const last = currentPage * todosPerPage;
  const first = last - todosPerPage;
  const currentTodos = filtered.slice(first, last);

  return (
    <div className="container py-4">
      <h1 className="mb-4">📝 Todo List App</h1>
      <TodoForm onAdd={addTodo} />
      <div className="row mb-3">
        <div className="col-md-4">
          <input className="form-control" placeholder="Search task..." value={search}
            onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="col-md-3">
          <input className="form-control" type="date" value={fromDate}
            onChange={(e) => setFromDate(e.target.value)} />
        </div>
        <div className="col-md-3">
          <input className="form-control" type="date" value={toDate}
            onChange={(e) => setToDate(e.target.value)} />
        </div>
      </div>
      {loading ? <p>Loading...</p> : <>
        <TodoList todos={currentTodos} />
        <Pagination total={filtered.length} perPage={todosPerPage} current={currentPage} setPage={setCurrentPage} />
      </>}
    </div>
  );
}

function randomDate(start, end) {
  return new Date(+new Date(start) + Math.random() * (new Date(end) - new Date(start)))
    .toISOString().slice(0, 10);
}
