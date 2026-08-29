"use client";

import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export interface ConfirmDialogState {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
}

export const CONFIRM_DIALOG_CLOSED: ConfirmDialogState = {
  open: false,
  title: '',
  description: '',
  onConfirm: () => {},
};

/** Replaces window.confirm() with a dialog that matches the rest of the admin UI. */
export function ConfirmDialog({
  state,
  onOpenChange,
}: {
  state?: ConfirmDialogState;
  onOpenChange: (open: boolean) => void;
}) {
  const isOpen = state?.open ?? false;
  const title = state?.title ?? '';
  const description = state?.description ?? '';
  const confirmLabel = state?.confirmLabel || 'אישור';
  const cancelLabel = state?.cancelLabel || 'ביטול';
  const destructive = state?.destructive ?? false;
  const onConfirm = state?.onConfirm ?? (() => {});

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent dir="rtl" className="text-right">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className="whitespace-pre-line">{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-start">
          <AlertDialogAction
            onClick={onConfirm}
            className={destructive ? 'bg-red-600 hover:bg-red-700 text-white' : ''}
          >
            {confirmLabel}
          </AlertDialogAction>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
