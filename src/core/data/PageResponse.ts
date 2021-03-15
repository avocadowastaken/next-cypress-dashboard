function toPositiveNumber(input: unknown, defaultValue: number = 1): number {
  let value = input == null ? NaN : Number(input);

  if (Number.isFinite(value)) {
    value = Math.max(value, 1);
  } else {
    value = defaultValue;
  }

  return value;
}

export interface PageInput {
  page?: unknown;
  nodesPerPage?: unknown;
}

interface PageResponseNodesArgs {
  take: number;
  skip: number;
}

export interface PageResponseOptions<TData> {
  maxNodesPerPage?: number;
  defaultNodesPerPage?: number;
  getCount: () => Promise<number>;
  getNodes: (args: PageResponseNodesArgs) => Promise<TData[]>;
}

export interface PageResponse<TData> {
  count: number;
  nodes: TData[];

  page: number;
  maxPage: number;
  nodesPerPage: number;
}

export async function createPageResponse<TData>(
  input: PageInput,
  {
    getCount,
    getNodes,
    maxNodesPerPage = 100,
    defaultNodesPerPage = 10,
  }: PageResponseOptions<TData>
): Promise<PageResponse<TData>> {
  const page = toPositiveNumber(input.page);
  const nodesPerPage = Math.min(
    maxNodesPerPage,
    toPositiveNumber(input.nodesPerPage, defaultNodesPerPage)
  );

  const nodesInput: PageResponseNodesArgs = {
    take: nodesPerPage,
    skip: (page - 1) * nodesPerPage,
  };

  const [count, nodes] = await Promise.all([getCount(), getNodes(nodesInput)]);

  const maxPage = Math.ceil(count / nodesPerPage);

  return { page, maxPage, nodes, count, nodesPerPage };
}
