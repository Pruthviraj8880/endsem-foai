function NewsSearch({ value, onChange }) {
  return (
    <label className="news-search">
      <span>Search News</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search space or technology..."
      />
    </label>
  );
}

export default NewsSearch;
