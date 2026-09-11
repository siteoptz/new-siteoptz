export interface MetricTableColumn {
  key: string;
  label: string;
  numeric?: boolean;
}

export interface MetricTableProps {
  caption: string;
  columns: MetricTableColumn[];
  rows: Record<string, string | number>[];
  source: string;
}

/**
 * When source is 'placeholder', every numeric cell renders an em dash and a
 * visible marker appears below the table — the prebuild content check
 * already fails production on placeholder content; this makes it visible
 * in preview too.
 */
export default function MetricTable({ caption, columns, rows, source }: MetricTableProps) {
  const isPlaceholder = source === "placeholder";

  return (
    <figure className="border border-rule">
      <figcaption className="border-b border-rule bg-paper-2 px-4 py-3 font-display text-sm">
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
                    {column.numeric && isPlaceholder ? "—" : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption className="border-t border-rule px-4 py-2 text-2xs text-muted">
        Source: {isPlaceholder ? "placeholder — figures pending client approval" : source}
      </figcaption>
      {isPlaceholder ? (
        <p className="border-t border-dashed border-rule bg-paper-2 px-4 py-2 text-2xs font-medium text-ink">
          Placeholder figures — this fails the production build until replaced.
        </p>
      ) : null}
    </figure>
  );
}
