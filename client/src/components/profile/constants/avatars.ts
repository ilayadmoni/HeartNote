/**
 * Happy avatar options — single source of truth for both the picker and
 * new-user default avatar selection.
 *
 * Uses DiceBear Avataaars v9. Expression params restrict generated faces to
 * positive emotions only:
 *   mouth      -> smile, twinkle, tongue  (no sad/grimace/scream)
 *   eyebrows   -> default, defaultNatural, flatNatural, raisedExcited,
 *                 raisedExcitedNatural    (no angry/frown/sadConcerned)
 *
 * Labels are the avatar's given name (product content, kept as authored
 * rather than translated per-locale — see area report).
 */

export interface AvatarOption {
  id: string;
  url: string;
  label: string;
}

export const HAPPY_AVATAR_OPTIONS: AvatarOption[] = [
  { id: "1",  url: "https://api.dicebear.com/9.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4&mouth=smile,twinkle,tongue&eyebrows=default,defaultNatural,flatNatural,raisedExcited,raisedExcitedNatural",   label: "פליקס" },
  { id: "2",  url: "https://api.dicebear.com/9.x/avataaars/svg?seed=Aneka&backgroundColor=c0aede&mouth=smile,twinkle,tongue&eyebrows=default,defaultNatural,flatNatural,raisedExcited,raisedExcitedNatural",   label: "אנקה" },
  { id: "3",  url: "https://api.dicebear.com/9.x/avataaars/svg?seed=Zoe&backgroundColor=d1d4f9&mouth=smile,twinkle,tongue&eyebrows=default,defaultNatural,flatNatural,raisedExcited,raisedExcitedNatural",     label: "זואי" },
  { id: "4",  url: "https://api.dicebear.com/9.x/avataaars/svg?seed=Chase&backgroundColor=ffd5dc&mouth=smile,twinkle,tongue&eyebrows=default,defaultNatural,flatNatural,raisedExcited,raisedExcitedNatural",   label: "צ׳ייס" },
  { id: "5",  url: "https://api.dicebear.com/9.x/avataaars/svg?seed=Bella&backgroundColor=ffdfbf&mouth=smile,twinkle,tongue&eyebrows=default,defaultNatural,flatNatural,raisedExcited,raisedExcitedNatural",   label: "בלה" },
  { id: "6",  url: "https://api.dicebear.com/9.x/avataaars/svg?seed=Oliver&backgroundColor=c1f0c1&mouth=smile,twinkle,tongue&eyebrows=default,defaultNatural,flatNatural,raisedExcited,raisedExcitedNatural",  label: "אוליבר" },
  { id: "7",  url: "https://api.dicebear.com/9.x/avataaars/svg?seed=Luna&backgroundColor=f9d1f9&mouth=smile,twinkle,tongue&eyebrows=default,defaultNatural,flatNatural,raisedExcited,raisedExcitedNatural",    label: "לונה" },
  { id: "8",  url: "https://api.dicebear.com/9.x/avataaars/svg?seed=Max&backgroundColor=b8e0f7&mouth=smile,twinkle,tongue&eyebrows=default,defaultNatural,flatNatural,raisedExcited,raisedExcitedNatural",     label: "מקס" },
  { id: "9",  url: "https://api.dicebear.com/9.x/avataaars/svg?seed=Riley&backgroundColor=ffc3a0&mouth=smile,twinkle,tongue&eyebrows=default,defaultNatural,flatNatural,raisedExcited,raisedExcitedNatural",   label: "ריילי" },
  { id: "10", url: "https://api.dicebear.com/9.x/avataaars/svg?seed=Noa&backgroundColor=c4f1be&mouth=smile,twinkle,tongue&eyebrows=default,defaultNatural,flatNatural,raisedExcited,raisedExcitedNatural",     label: "קוקי" },
  { id: "11", url: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sasha&backgroundColor=e8d5b7&mouth=smile,twinkle,tongue&eyebrows=default,defaultNatural,flatNatural,raisedExcited,raisedExcitedNatural",   label: "סאשה" },
  { id: "12", url: "https://api.dicebear.com/9.x/avataaars/svg?seed=Jade&backgroundColor=b5d8eb&mouth=smile,twinkle,tongue&eyebrows=default,defaultNatural,flatNatural,raisedExcited,raisedExcitedNatural",    label: "ג׳ייד" },
];

/** Alias kept for backward compatibility — always points to HAPPY_AVATAR_OPTIONS. */
export const DEFAULT_AVATAR_OPTIONS: AvatarOption[] = HAPPY_AVATAR_OPTIONS;

/** Flat URL list for components that only need strings (e.g. AvatarSelector). */
export const AVATAR_URLS: string[] = HAPPY_AVATAR_OPTIONS.map((a) => a.url);
