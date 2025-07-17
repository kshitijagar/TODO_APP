export default function Pagination({ total, perPage, current, setPage }) {
  const pages = Math.ceil(total / perPage);
  return (
    <div className="mt-3">
      {Array.from({ length: pages }, (_, i) => (
        <button key={i} className={`btn btn-sm me-2 ${current === i + 1 ? 'btn-dark' : 'btn-outline-dark'}`}
          onClick={() => setPage(i + 1)}>
          {i + 1}
        </button>
      ))}
    </div>
  );
}
