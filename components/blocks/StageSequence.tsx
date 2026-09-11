export interface StageSequenceItem {
  number: string;
  title: string;
  body: string;
  when: string;
}

export interface StageSequenceProps {
  stages: StageSequenceItem[];
}

/**
 * The four-stage engagement process — the only component in the codebase
 * permitted to render numbered markers, because it is the only content
 * that is genuinely a sequence. 1px gaps using the rule hairline so the
 * cells read as a grid.
 */
export default function StageSequence({ stages }: StageSequenceProps) {
  return (
    <div className="grid grid-cols-1 gap-px bg-rule min-[560px]:grid-cols-2 min-[900px]:grid-cols-4">
      {stages.map((stage) => (
        <div key={stage.number} className="bg-base p-6">
          <p className="text-sm text-accent">{stage.number}</p>
          <h3 className="mt-2 text-white">{stage.title}</h3>
          <p className="mt-2 text-text">{stage.body}</p>
          <p className="mt-3 text-sm text-muted">{stage.when}</p>
        </div>
      ))}
    </div>
  );
}
