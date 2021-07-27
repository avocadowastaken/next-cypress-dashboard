import {
  Pagination,
  PaginationItem,
  TableCell,
  TableFooter,
  TableRow,
} from "@material-ui/core";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";

export interface TablePagerProps {
  page: number;
  maxPage: number;
}

export function TablePager({ page, maxPage }: TablePagerProps): ReactElement {
  const { pathname, query } = useRouter();

  return (
    <TableFooter>
      <TableRow>
        <TableCell colSpan={3}>
          <Pagination
            page={page}
            count={maxPage}
            renderItem={(item) => (
              <NextLink
                passHref={true}
                href={{ pathname, query: { ...query, page: item.page } }}
              >
                <PaginationItem {...item} />
              </NextLink>
            )}
          />
        </TableCell>
      </TableRow>
    </TableFooter>
  );
}
