"use client";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { X } from "@phosphor-icons/react";
import type { PropsWithChildren, ReactNode } from "react";

import { cn } from "@/components/utils";

import { Button } from "./button";

export default function Modal({
  open,
  close,
  children,
  title,
  panelClassName,
}: PropsWithChildren<{
  open: boolean;
  close: () => void;
  title?: ReactNode;
  panelClassName?: string;
}>) {
  return (
    <Transition show={open}>
      <Dialog className="relative z-10" onClose={close}>
        <TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500/75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center text-center sm:items-center">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel
                className={cn(
                  "relative overflow-hidden rounded-t-xl sm:rounded-b-xl max-sm:w-full bg-white px-6 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6",
                  panelClassName,
                )}
              >
                {title && (
                  <div className="flex items-center justify-between">
                    <DialogTitle className="text-xl font-medium font-serif ">
                      {title}
                    </DialogTitle>
                    <Button onClick={close} square borderless invert>
                      <X size={18} weight="bold" />
                    </Button>
                  </div>
                )}
                {children}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
