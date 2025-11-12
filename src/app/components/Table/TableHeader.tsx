"use client";

interface Props {
  min: number;
  max: number;
  handleSort: (column: number) => void;
}

export default function TableHeader({ min, max, handleSort }: Props) {
  const gameweeks = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <thead>
      <tr>
        <th
          className="px-2 py-2 text-left text-xs font-medium text-gray-600 cursor-pointer select-none"
          onClick={() => handleSort(0)}
        >
          Team
        </th>
        {gameweeks.map((gameweek) => (
          <th
            key={gameweek}
            className="px-2 py-2 text-center text-xs font-medium text-gray-600 cursor-pointer select-none"
            onClick={() => handleSort(gameweek - min + 1)}
          >
            GW {gameweek}
          </th>
        ))}
      </tr>
    </thead>
  );
}
