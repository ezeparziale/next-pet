"use client";

import { useOperatingSystem } from "@/lib/hooks/use-operating-system";
import React, { useCallback, useEffect, useState } from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "./ui/button";
import usePetStore from "@/stores/pet-store";
import { RefreshCw } from "lucide-react";
import { DialogTitle } from "./ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";

export default function CommandMenu() {
  const [open, setOpen] = useState(false);
  const { isMacOS } = useOperatingSystem();
  const { reset } = usePetStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        variant={"ghost"}
        onClick={() => setOpen(true)}
        className="items-center p-1"
      >
        <p className="space-x-1 text-sm text-muted-foreground">
          <span>Command menu</span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">{isMacOS ? "⌘" : "ctrl"}</span>
          </kbd>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">K</span>
          </kbd>
        </p>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogTitle className="hidden">Command menu</DialogTitle>
        <DialogDescription className="hidden">Command menu</DialogDescription>
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem
              onSelect={() => {
                runCommand(() => reset());
              }}
            >
              <RefreshCw className="mr-2 size-4" />
              <span>Restart</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </>
  );
}
