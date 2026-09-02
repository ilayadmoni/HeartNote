/**
 * FAQ item ids. Question/answer copy lives in the `faq` message
 * namespace (`items.<id>.question` / `.answer`); this array only
 * controls display order.
 */
export const FAQ_ITEM_IDS = [
  "item-1",
  "item-2",
  "item-3",
  "item-4",
  "item-5",
  "item-6",
  "item-7",
  "item-8",
  "item-9",
  "item-10",
  "item-11",
] as const;

export type FaqItemId = (typeof FAQ_ITEM_IDS)[number];
