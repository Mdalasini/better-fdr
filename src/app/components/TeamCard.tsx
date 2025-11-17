"use client";

import Image from "next/image";
import type { TeamData } from "@/lib/types/teams";

interface TeamCardProps {
  team: TeamData;
}

export default function TeamCard({ team }: TeamCardProps) {
  return (
    <div className="group bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200">
      <div className="flex flex-col items-center text-center gap-2">
        {/* Team Logo */}
        <div className="mb-4 w-20 h-20 relative rounded-full ring-1 ring-gray-200 bg-gray-50 overflow-hidden group-hover:ring-blue-200 transition-colors">
          <Image
            src={team.logo_path}
            alt={`${team.name} logo`}
            fill
            className="object-contain p-2"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
        </div>

        {/* Team Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-1 tracking-tight">
          {team.name}
        </h3>

        {/* Short Name */}
        <p className="text-xs sm:text-sm text-gray-500 mb-4 px-2 py-0.5 rounded-full bg-gray-100">
          {team.short_name}
        </p>

        {/* Ratings */}
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between px-3.5 py-2.5 bg-gray-50/80 rounded-lg border border-gray-100">
            <span className="text-sm font-medium text-gray-700">
              Offensive:
            </span>
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-200">
              {team.off_rating.toFixed(1)}
            </span>
          </div>
          <div className="flex items-center justify-between px-3.5 py-2.5 bg-gray-50/80 rounded-lg border border-gray-100">
            <span className="text-sm font-medium text-gray-700">
              Defensive:
            </span>
            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-200">
              {team.def_rating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
