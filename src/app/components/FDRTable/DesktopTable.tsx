"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import type { SortType, TeamRowData } from "@/lib/utils/fixtures";

interface DesktopTableProps {
  teamRows: TeamRowData[];
  visibleGameweeks: number[];
  sortType: SortType;
  sortDirection: "asc" | "desc";
  onSort: (event: number) => void;
}

export function DesktopTable({
  teamRows,
  visibleGameweeks,
  sortType,
  sortDirection,
  onSort,
}: DesktopTableProps) {
  const isSortedByEvent = (gw: number) =>
    sortType.type === "event" && sortType.event === gw;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="sticky left-0 bg-white z-10 px-3 py-2 text-left text-sm font-medium text-slate-900 border-b border-slate-200">
              Team
            </th>
            {visibleGameweeks.map((gw) => (
              <th
                key={gw}
                className="px-2 py-2 text-center text-sm font-medium text-slate-900 border-b border-slate-200 cursor-pointer hover:bg-slate-50 select-none"
                onClick={() => onSort(gw)}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>GW{gw}</span>
                  {isSortedByEvent(gw) && (
                    <span className="text-slate-500">
                      {sortDirection === "asc" ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {teamRows.map((row) => (
            <tr key={row.team.id} className="border-b border-slate-100">
              <td className="sticky left-0 bg-white z-10 px-3 py-2 text-sm font-medium text-slate-900 whitespace-nowrap">
                {row.team.short_name}
              </td>
              {visibleGameweeks.map((gw) => {
                const eventData = row.events.get(gw);
                if (!eventData || eventData.fixtures.length === 0) {
                  return (
                    <td
                      key={gw}
                      className="px-2 py-2 text-center text-sm bg-slate-50"
                    >
                      <span className="text-slate-400">-</span>
                    </td>
                  );
                }

                return (
                  <td
                    key={gw}
                    className={`px-2 py-2 text-center text-sm ${eventData.color}`}
                  >
                    <div className="flex flex-col gap-0.5">
                      {eventData.fixtures.map((f) => (
                        <span
                          key={f.fixture.id}
                          className="text-slate-700 whitespace-nowrap"
                        >
                          {f.isHome ? "H" : "A"}: {f.opponent.short_name}
                        </span>
                      ))}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
