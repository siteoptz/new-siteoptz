type ContainerTag = "div" | "header" | "footer" | "nav" | "main" | "section";

export interface ContainerProps {
  children: React.ReactNode;
  as?: ContainerTag;
}

/**
 * Max-width var(--container-site) and horizontal padding var(--spacing-gutter),
 * centered. Nothing else — no vertical spacing ever. Section does not render
 * this internally; pages compose Section > Container explicitly.
 */
export default function Container({ children, as = "div" }: ContainerProps) {
  const Tag = as;
  return <Tag className="mx-auto max-w-site px-gutter">{children}</Tag>;
}
