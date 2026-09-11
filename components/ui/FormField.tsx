export interface FormFieldRenderProps {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
}

export interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: (renderProps: FormFieldRenderProps) => React.ReactNode;
}

/**
 * Wires a label, an optional hint, and an error message to whatever field
 * element the children render, via aria-describedby and aria-invalid — so no
 * field can end up with an error that isn't actually associated with it.
 */
export default function FormField({ id, label, error, hint, optional, children }: FormFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {optional ? <span className="font-normal text-muted"> (optional)</span> : null}
      </label>
      {hint ? (
        <p id={hintId} className="mb-1.5 text-2xs text-muted">
          {hint}
        </p>
      ) : null}
      {children({ id, "aria-describedby": describedBy, "aria-invalid": error ? true : undefined })}
      {error ? (
        <p id={errorId} className="mt-1.5 text-2xs text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
