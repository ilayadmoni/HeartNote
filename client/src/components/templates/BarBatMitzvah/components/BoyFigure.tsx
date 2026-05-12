import Image from "next/image";

interface BoyFigureProps {
  onClick?: () => void;
}

export function BoyFigure({ onClick }: BoyFigureProps) {
  return (
    <Image
      src="/assets/images/BarBatMitzva/bar_mitzvah_boy.png"
      alt="ילד בר מצווה"
      width={280}
      height={360}
      priority
      draggable={false}
      onClick={onClick}
      className="object-contain pointer-events-auto cursor-pointer drop-shadow-md select-none"
      unoptimized
    />
  );
}
