export default function Table({ headers, rows, renderCell }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[620px] border-collapse">
        <thead>
          <tr className="bg-canvas">
            {headers.map((header) => (
              <th
                key={header}
                className="border-b border-line px-3 py-3 text-left text-[9px] font-bold uppercase tracking-[0.09em] text-mid first:rounded-l-[10px] last:rounded-r-[10px]"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-canvas-2">
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="whitespace-nowrap border-b border-line px-3 py-4 text-[12px] text-ink-soft last:border-b-0"
                >
                  {renderCell ? renderCell(cell, cellIndex, row) : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
