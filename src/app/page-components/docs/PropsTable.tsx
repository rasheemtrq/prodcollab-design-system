import React from 'react';

export type PropRow = {
  name: string;
  type: string;
  default?: string;
  description: string;
};

const PropsTable: React.FC<{ rows: PropRow[] }> = ({ rows }) => (
  <section className="mb-12">
    <h2 className="text-xl tracking-tight mb-4">Props</h2>
    <div className="overflow-x-auto border border-secondary rounded-2xl">
      <table className="w-full text-sm text-left">
        <thead className="text-secondary bg-secondary">
          <tr>
            <th scope="col" className="px-4 py-3 font-normal">Prop</th>
            <th scope="col" className="px-4 py-3 font-normal">Type</th>
            <th scope="col" className="px-4 py-3 font-normal">Default</th>
            <th scope="col" className="px-4 py-3 font-normal">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-t border-secondary align-top">
              <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">{r.name}</td>
              <td className="px-4 py-3 font-mono text-xs text-secondary">{r.type}</td>
              <td className="px-4 py-3 font-mono text-xs text-secondary whitespace-nowrap">{r.default ?? '—'}</td>
              <td className="px-4 py-3 text-secondary font-light">{r.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

export default PropsTable;
