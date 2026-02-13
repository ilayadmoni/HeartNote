"use client";

import { TextCardEditor } from "./editors/TextCardEditor";

/** @deprecated Legacy card type — kept for backward compatibility. */
interface Card {
  cardType: string;
  content: { text: string };
}

interface CardEditorProps {
  card: Card;
  onChange: (content: Card["content"]) => void;
}

export function CardEditor({ card, onChange }: CardEditorProps) {
  // Render appropriate editor based on card type
  switch (card.cardType) {
    case "text":
      return <TextCardEditor content={card.content} onChange={onChange} />;
    case "checklist":
      return <div>Checklist Editor (TODO)</div>;
    case "image":
      return <div>Image Editor (TODO)</div>;
    case "link":
      return <div>Link Editor (TODO)</div>;
    case "code":
      return <div>Code Editor (TODO)</div>;
    default:
      return <div>Unknown card type</div>;
  }
}
