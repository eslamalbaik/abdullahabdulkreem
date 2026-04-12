import { useEffect, useState } from "react";

interface ConfettiPiece {
  id: number;
  left: string;
  color: string;
  duration: string;
  delay: string;
  drift: string;
  size: string;
}

const COLORS = [
  "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF",
  "#FF5733", "#33FF57", "#3357FF", "#F0E68C", "#FFD700", "#FF69B4"
];

export function Confetti({ count = 100 }: { count?: number }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const newPieces: ConfettiPiece[] = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      duration: `${2 + Math.random() * 3}s`,
      delay: `${Math.random() * 2}s`,
      drift: `${(Math.random() - 0.5) * 100}px`,
      size: `${5 + Math.random() * 10}px`,
    }));
    setPieces(newPieces);
  }, [count]);

  return (
    <div className="confetti-container">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti"
          style={{
            left: piece.left,
            backgroundColor: piece.color,
            width: piece.size,
            height: piece.size,
            "--confetti-color": piece.color,
            "--confetti-duration": piece.duration,
            "--confetti-timing": "ease-out",
            "--confetti-drift": piece.drift,
            animationDelay: piece.delay,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
