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
 * that is genuinely a sequence. 1px gaps over navy-700 so the cells read
 * as a grid.
 */
export default function StageSequence({ stages }: StageSequenceProps) {
  return (
    <div className="grid grid-cols-1 gap-px bg-navy-700 min-[560px]:grid-cols-2 min-[900px]:grid-cols-4">
      {stages.map((stage) => (
        <div key={stage.number} className="bg-navy-900 p-6">
          <p className="text-sm text-blue-300">{stage.number}</p>
          <h3 className="mt-2 text-white">{stage.title}</h3>
          <p className="mt-2 text-[#C3CDDF]">{stage.body}</p>
          <p className="mt-3 text-sm text-[#93A3BD]">{stage.when}</p>
        </div>
      ))}
    </div>
  );
}
