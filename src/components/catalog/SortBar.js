export default function SortBar({ value, onChange }) {
  return (
    <select
      className="border rounded px-3 py-2"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="newest">Newest</option>
      <option value="price-asc">Price: Low → High</option>
      <option value="price-desc">Price: High → Low</option>
      <option value="rating">Top Rated</option>
    </select>
  );
}
