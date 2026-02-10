"use client";
import { Check, CaretDown } from "@phosphor-icons/react";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { UseFormReturn } from "react-hook-form";
import { FixedSizeList } from "react-window";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/components/utils";

import { SelectProps } from "../input/types";

export function Select({ options, rules, multiple, ...rest }: SelectProps) {
  const [open, setOpen] = useState(false);
  const formContext = useFormContext() as UseFormReturn | undefined;
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState<(string | number)[]>([]);

  const filteredOptions = useMemo(
    () =>
      !searchTerm
        ? options
        : options.filter((option) =>
            option.label
              .toLowerCase()
              .replaceAll(" ", "")
              .includes(searchTerm.toLowerCase().replaceAll(" ", "")),
          ),
    [searchTerm, options],
  );

  const updateValue = (newValue: string | number | (string | number)[]) => {
    setSelected(
      Array.isArray(newValue) ? newValue : newValue ? [newValue] : [],
    );
  };

  useEffect(() => {
    if (!rest.name) return;
    const value = formContext?.getValues(rest.name);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- form value sync is required for controlled display state
    updateValue(value);
    const sub = formContext?.watch((values, { name }) => {
      if (!rest.name || name !== rest.name) return;
      const newValue = values[rest.name];
      updateValue(newValue);
    });
    return sub?.unsubscribe;
  }, [formContext, rest.name]);

  const { values, labels } = useMemo(() => {
    const selectedValues = options.filter((option) =>
      selected.includes(option.value),
    );
    return {
      values: selectedValues.map((option) => option.value),
      labels: selectedValues.map((option) => option.label),
    };
  }, [options, selected]);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <input
        {...(formContext?.register && rest.name
          ? formContext.register(rest.name, rules)
          : {})}
        {...rest}
        className="hidden"
        placeholder={undefined}
      />
      <PopoverTrigger asChild>
        <button
          role="combobox"
          aria-expanded={open}
          className={cn(
            rest.className,
            "flex justify-between items-center",
            values.length || rest.defaultValue ? "" : "text-gray-400",
          )}
        >
          <span className="line-clamp-1 overflow-hidden">
            {values.length
              ? labels.join(", ")
              : rest.defaultValue ||
                rest.placeholder || <span className="opacity-0">.</span>}
          </span>
          <CaretDown
            className={cn(
              "ml-4 h-4 w-4 shrink-0 ",
              rest.loading ? "opacity-0" : "opacity-50",
            )}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent className="bg-white">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={rest.placeholder}
            value={searchTerm}
            onValueChange={(val) => {
              setSearchTerm(val);
              if (rest.name) formContext?.setValue(rest.name, val);
            }}
          />
          <CommandList>
            <CommandEmpty>
              {rest.loading
                ? "Loading results..."
                : selected.length && options.length
                  ? "No matches found."
                  : "Start typing to search..."}
            </CommandEmpty>
            <CommandGroup>
              <FixedSizeList
                itemSize={32}
                height={Math.min(filteredOptions.length, 9) * 32}
                itemCount={filteredOptions.length}
                width={"100%"}
                itemData={filteredOptions}
              >
                {({ index, style }) => {
                  const option = filteredOptions[index];
                  if (!option) return null;
                  return (
                    <CommandItem
                      style={style}
                      key={option.value}
                      value={option.label}
                      onSelect={() => {
                        if (multiple) {
                          const newSelected = selected.includes(option.value)
                            ? selected.filter((value) => value !== option.value)
                            : [...selected, option.value];

                          setSelected(newSelected);
                          if (rest.name)
                            formContext?.setValue(rest.name, newSelected);
                        } else {
                          if (rest.name)
                            formContext?.setValue(rest.name, option.value);
                          setSelected([option.value]);
                          setOpen(false);
                        }
                      }}
                      className="text-xs"
                    >
                      <span className="line-clamp-1 overflow-hidden">
                        {option.label}
                      </span>

                      {values.includes(option.value) && (
                        <Check className={cn("size-3 text-accent")} />
                      )}
                    </CommandItem>
                  );
                }}
              </FixedSizeList>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
