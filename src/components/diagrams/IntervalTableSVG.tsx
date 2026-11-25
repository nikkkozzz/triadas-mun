import React from 'react';
import { IntervalStripItem, TableBlockData } from '../../types/course';

interface IntervalStripProps {
  title: string;
  subtitle?: string;
  items: IntervalStripItem[];
}

export const IntervalStrip: React.FC<IntervalStripProps> = ({ title, subtitle, items }) => {
  return (
    <div className="my-6 rounded-2xl border border-black/[0.08] dark:border-white/[0.1] bg-[#f5f5f7] dark:bg-[#161617] p-5">
      <div className="mb-3.5">
        <h4 className="text-[15px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">{title}</h4>
        {subtitle && (
          <p className="text-[13px] text-[#6e6e73] dark:text-[#a1a1a6] mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="overflow-x-auto pb-1">
        <div
          className="grid gap-1.5 min-w-[540px]"
          style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
        >
          {items.map((item, idx) => {
            const boxStyle =
              item.highlight === 'root'
                ? 'bg-[#ff3b30] dark:bg-[#ff453a] text-white border-transparent'
                : item.highlight === 'chord'
                  ? 'bg-[#1d1d1f] dark:bg-[#f5f5f7] text-white dark:text-[#1d1d1f] border-transparent'
                  : item.highlight === 'tension'
                    ? 'bg-[#0071e3]/12 dark:bg-[#0a84ff]/20 text-[#0071e3] dark:text-[#64d2ff] border-[#0a84ff]/30'
                    : item.highlight === 'avoid'
                      ? 'bg-[#ff9f0a]/15 text-[#b25000] dark:text-[#ffd60a] border-[#ff9f0a]/30'
                      : item.highlight === 'altered'
                        ? 'bg-black/[0.08] dark:bg-white/[0.06] text-[#6e6e73] dark:text-[#86868b] border-black/[0.06] dark:border-white/[0.08]'
                        : 'bg-white dark:bg-[#242426] text-[#1d1d1f] dark:text-[#f5f5f7] border-black/[0.08] dark:border-white/[0.1]';

            return (
              <div
                key={`${item.label}-${idx}`}
                className={`rounded-xl border px-2 py-2.5 text-center flex flex-col items-center justify-center ${boxStyle}`}
              >
                <span className="font-mono text-[13px] font-bold leading-tight">{item.label}</span>
                {item.sublabel && (
                  <span className="font-mono text-[10px] opacity-80 mt-1 leading-none">
                    {item.sublabel}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface DataTableBlockProps {
  data: TableBlockData;
}

export const DataTableBlock: React.FC<DataTableBlockProps> = ({ data }) => {
  return (
    <div className="my-6 rounded-2xl border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#161617] overflow-hidden">
      <div className="px-5 py-4 border-b border-black/[0.06] dark:border-white/[0.08] bg-[#f5f5f7] dark:bg-[#1c1c1e]">
        <h4 className="text-[15px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
          {data.title}
        </h4>
        {data.subtitle && (
          <p className="text-[13px] text-[#6e6e73] dark:text-[#a1a1a6] mt-0.5">{data.subtitle}</p>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-[14px]">
          <thead>
            <tr className="border-b border-black/[0.06] dark:border-white/[0.08] text-[12px] uppercase tracking-wider text-[#6e6e73] dark:text-[#86868b]">
              {data.headers.map((h, i) => (
                <th key={i} className="px-4 py-3 font-semibold whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.05] dark:divide-white/[0.06]">
            {data.rows.map((row, rIdx) => (
              <tr
                key={rIdx}
                className="hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors"
              >
                {row.map((cell, cIdx) => (
                  <td
                    key={cIdx}
                    className={`px-4 py-3 ${
                      cIdx === 0
                        ? 'font-semibold font-mono text-[#1d1d1f] dark:text-[#f5f5f7] whitespace-nowrap'
                        : 'text-[#424245] dark:text-[#d1d1d6]'
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
