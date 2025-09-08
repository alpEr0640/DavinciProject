import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../alert-dialog";

type ConfirmOptions = {
  title: string;
  description?: React.ReactNode;
  actionText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
};

type ConfirmFn = (opts: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState<ConfirmOptions>({ title: "" });
  const resolverRef = useRef<((v: boolean) => void) | null>(null);

  const confirm: ConfirmFn = (options) => {
    setOpts({
      cancelText: "Vazgeç",
      actionText: "Onayla",
      variant: "default",
      ...options,
    });
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  };

  const resolve = (value: boolean) => {
    setOpen(false);
    resolverRef.current?.(value);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <AlertDialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) resolverRef.current?.(false);
          setOpen(isOpen);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{opts.title}</AlertDialogTitle>
            {opts.description && (
              <AlertDialogDescription>
                {opts.description}
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center items-center">
            <AlertDialogCancel onClick={() => resolve(false)}>
              {opts.cancelText}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => resolve(true)}
              className={opts.variant === "destructive" ? "" : undefined}
            >
              {opts.actionText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within ConfirmProvider");
  return ctx;
}
