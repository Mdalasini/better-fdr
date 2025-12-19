"use client";

import type { TeamRowData } from "@/lib/utils/fixtures";

interface MobileCardsProps {
  teamRows: TeamRowData[];
  visibleGameweeks: number[];
}

export function MobileCards({ teamRows, visibleGameweeks }: MobileCardsProps) {
  return (
    <div className="space-y-4">
      {teamRows.map((row) => (
        <div
          key={row.team.id}
          className="bg-white rounded-lg border border-slate-200 overflow-hidden"
        >
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
            <h3 className="font-medium text-slate-900">{row.team.name}</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {visibleGameweeks.map((gw) => {
              const eventData = row.events.get(gw);
              const hasFixtures = eventData && eventData.fixtures.length > 0;

              return (
                <div
                  key={gw}
                  className={`px-4 py-2 flex items-center justify-between ${
                    hasFixtures ? eventData.color : "bg-slate-50"
                  }`}
                >
                  <span className="text-sm font-medium text-slate-600">
                    GW{gw}
                  </span>
                  <div className="text-sm text-slate-700">
                    {hasFixtures ? (
                      <div className="flex flex-col items-end gap-0.5">
                        {eventData.fixtures.map((f) => (
                          <span key={f.fixture.id}>
                            {f.isHome ? "H" : "A"}: {f.opponent.short_name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
