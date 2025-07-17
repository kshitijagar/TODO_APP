export default function TodoList({ todos }) {
  if (todos.length === 0) return <p>No todos found.</p>;

  return (
    <ul className="list-group">
      {todos.map(todo => (
        <li key={todo.id} className="list-group-item d-flex justify-content-between">
          <span>{todo.todo}</span>
          <span className="text-muted small">{todo.date}</span>
        </li>
      ))}
    </ul>
  );
}
