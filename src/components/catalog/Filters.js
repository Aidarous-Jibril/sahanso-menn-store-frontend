export default function Filters({ facets, values, onChange }) {
  const toggle = (key, val) => {
    const current = (values[key] || "").split(",").filter(Boolean);
    const next = current.includes(val) ? current.filter((v) => v !== val) : [...current, val];
    onChange({ [key]: next.join(",") });
  };

  return (
    <div className="space-y-6">
      {/* Brand */}
      <section>
        <h4 className="font-semibold mb-2">Brand</h4>
        <div className="space-y-1">
          {(facets.brands || []).map((b) => (
            <label key={b} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(values.brand || "").split(",").includes(b)}
                onChange={() => toggle("brand", b)}
              />
              <span>{b}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Price */}
      <section>
        <h4 className="font-semibold mb-2">Price</h4>
        <div className="flex gap-2">
          <input
            className="w-20 border rounded px-2 py-1"
            placeholder="Min"
            defaultValue={values.min || ""}
            onBlur={(e) => onChange({ min: e.target.value })}
          />
          <input
            className="w-20 border rounded px-2 py-1"
            placeholder="Max"
            defaultValue={values.max || ""}
            onBlur={(e) => onChange({ max: e.target.value })}
          />
        </div>
      </section>

      {/* Size */}
      <section>
        <h4 className="font-semibold mb-2">Size</h4>
        <div className="flex flex-wrap gap-2">
          {(facets.sizes ?? ["XS", "S", "M", "L", "XL"]).map((s) => {
            const active = (values.size || "").split(",").includes(s);
            return (
              <button
                key={s}
                className={`px-3 py-1 rounded border ${active ? "bg-black text-white" : ""}`}
                onClick={() => toggle("size", s)}
                type="button"
              >
                {s}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
