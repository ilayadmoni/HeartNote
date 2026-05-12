export const templateKeys = {
  all: ["templates"] as const,
  list: () => [...templateKeys.all, "list"] as const,
  detail: (slug: string) => [...templateKeys.all, "detail", slug] as const,
};
