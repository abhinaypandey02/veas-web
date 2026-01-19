import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowsDownUp,
} from "@phosphor-icons/react";
import {
  AccessorColumnDef,
  ColumnFiltersState,
  getFilteredRowModel,
  RowSelectionState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import React, { ReactNode, useEffect } from "react";

import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/components/utils";
export default function Table<T>({
  data,
  columns,
  totalPages,
  currentPage,
  cta,
  onSelect,
  onNext,
  pageSize,
}: {
  data: Partial<T>[];
  // eslint-disable-next-line -- needed package deps
  columns: AccessorColumnDef<T, any>[];
  totalPages?: number;
  currentPage?: number;
  cta?: ReactNode;
  onSelect?: (state: RowSelectionState) => void;
  onNext?: () => void;
  pageSize?: number;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  useEffect(() => {
    if (onSelect) onSelect(rowSelection);
  }, [onSelect, rowSelection]);

  const table = useReactTable({
    // @ts-expect-error -- partial is required for dynamic
    data: data,
    columns: columns.map((col) => ({
      enableColumnFilter: false,
      enableSorting: false,
      ...col,
    })),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: pageSize || 10,
      },
    },
  });

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-center py-4 justify-between">
        <div className={"w-full max-w-sm"}>
          <Input
            name={""}
            placeholder="Search"
            className="text-sm py-1.5"
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              table.getAllColumns().forEach((col) => {
                if (col.getCanFilter()) col.setFilterValue(event.target.value);
              });
            }}
          />
        </div>
        {cta}
      </div>
      <table className={cn("w-full caption-bottom text-sm")}>
        <thead className={cn("")}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              className={cn(
                "border-b border-gray-300 hover:bg-muted/50 data-[state=selected]:bg-muted transition-colors",
              )}
              key={headerGroup.id}
            >
              {onSelect && (
                <th
                  className={cn(
                    "text-foreground h-10 px-2 py-3 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
                  )}
                >
                  <Checkbox
                    checked={
                      table.getIsAllPageRowsSelected() ||
                      (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) =>
                      table.toggleAllPageRowsSelected(!!value)
                    }
                    aria-label="Select all"
                  />
                </th>
              )}
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    onClick={() => header.column.toggleSorting()}
                    key={header.id}
                    className={cn(
                      "text-foreground h-10 px-2 py-3 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
                      header.column.getCanSort() ? "cursor-pointer" : "",
                    )}
                  >
                    <div className={cn("flex items-center gap-0.5 ")}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                      {header.column.getIsSorted() === "desc" ? (
                        <ArrowDown size={12} />
                      ) : header.column.getIsSorted() === "asc" ? (
                        <ArrowUp size={12} />
                      ) : (
                        header.column.getCanSort() && <ArrowsDownUp size={12} />
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, i) => (
              <tr
                className={cn(
                  "hover:bg-muted/100 data-[state=selected]:bg-muted  transition-colors",
                  i % 2 === 0 ? "" : "bg-muted/50",
                )}
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {onSelect && (
                  <td
                    className={cn(
                      "px-2 py-4 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
                    )}
                  >
                    <Checkbox
                      checked={row.getIsSelected()}
                      onCheckedChange={(value) => row.toggleSelected(!!value)}
                      aria-label="Select row"
                    />
                  </td>
                )}
                {row.getVisibleCells().map((cell) => (
                  <td
                    className={cn(
                      "px-2 py-4 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
                    )}
                    key={cell.id}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <td
              colSpan={columns.length}
              className="h-24 text-center w-full mt-10"
            >
              No results.
            </td>
          )}
        </tbody>
      </table>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className={"pl-2"}>
          Page{" "}
          <strong>
            {currentPage || table.getState().pagination.pageIndex + 1}
          </strong>{" "}
          of <strong>{totalPages || table.getPageCount()}</strong>
        </div>
        <div className={"flex items-center gap-4"}>
          {table.getCanPreviousPage() && (
            <Button
              invert
              compact
              className={"gap-2 flex"}
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Prev <ArrowLeft />
            </Button>
          )}
          {(onNext || table.getCanNextPage()) && (
            <Button
              className={"gap-2 flex"}
              compact
              onClick={onNext || table.nextPage}
            >
              Next <ArrowRight />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
