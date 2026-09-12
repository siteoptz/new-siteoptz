export interface MetricTableColumn {
  key: string;
  label: string;
  numeric?: boolean;
}

export interface MetricTableProps {
  caption: string;
  columns: MetricTableColumn[];
  rows: Record<string, string | number>[];
  /** Omit for a structural example with no data cells — see the row cell rendering below. */
  source?: string;
}

/**
 * A row's data cells are whatever keys it sets — a row with only its label
 * key renders empty data cells, for a structural example (the column
 * headers and row labels are real; there is no data yet to show).
 * scripts/content-check.ts's own placeholder gate is a text-search for
 * source="placeholder", independent of this component, so it still catches
 * that value if anyone reintroduces it later.
 */
export default function MetricTable({ caption, columns, rows, source }: MetricTableProps) {
  return (
    <figure className="border border-rule">
      <figcaption className="border-b border-rule bg-raised px-4 py-3 font-display text-sm">
        {caption}
      </figcaption>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm tabular-nums">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`border-b border-rule px-4 py-2 font-display whitespace-nowrap ${
                    column.numeric ? "text-right" : "text-left"
                  }`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`border-b border-rule px-4 py-2 whitespace-nowrap last:border-b-0 ${
                      column.numeric ? "text-right" : "text-left"
                    }`}
                  >
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {source ? (
        <figcaption className="border-t border-rule px-4 py-2 text-2xs text-muted">
          Source: {source}
        </figcaption>
      ) : null}
    </figure>
  );
}
