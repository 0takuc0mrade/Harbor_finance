import type { ContractLayer } from '@/lib/contracts';

interface ContractActionPanelProps {
  contractName: string;
  functionName: string;
  action: string;
  parameters: string[];
  layer: ContractLayer;
  note: string;
}

export default function ContractActionPanel({
  contractName,
  functionName,
  action,
  parameters,
  layer,
  note,
}: ContractActionPanelProps) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-orange-400">{layer}</p>
          <h3 className="mt-1 text-sm font-semibold text-white">{action}</h3>
        </div>
        <div className="rounded-lg border border-white/[0.06] bg-black/20 px-3 py-2 font-mono text-xs text-zinc-300">
          {contractName}.{functionName}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Example Parameters</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {parameters.map((parameter) => (
            <span
              key={parameter}
              className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-zinc-300"
            >
              {parameter}
            </span>
          ))}
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-zinc-400">{note}</p>
    </div>
  );
}
