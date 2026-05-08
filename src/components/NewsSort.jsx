function NewsSort({ value, onChange }) {
  return (
    <label className="news-sort">
      <span>Sort</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="date">Sort by Date</option>
        <option value="source">Sort by Source</option>
      </select>
    </label>
  );
}

export default NewsSort;
