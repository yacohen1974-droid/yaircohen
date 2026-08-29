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
  state: ConfirmDialogState;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <AlertDialog open={state.open} onOpenChange={onOpenChange}>
      <AlertDialogContent dir="rtl" className="text-right">
        <AlertDialogHeader>
          <AlertDialogTitle>{state.title}</AlertDialogTitle>
          <AlertDialogDescription className="whitespace-pre-line">{state.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-start">
          <AlertDialogAction
            onClick={state.onConfirm}
            className={state.destructive ? 'bg-red-600 hover:bg-red-700 text-white' : ''}
          >
            {state.confirmLabel || 'אישור'}
          </AlertDialogAction>
          <AlertDialogCancel>{state.cancelLabel || 'ביטול'}</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
