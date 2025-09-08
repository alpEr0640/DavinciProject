import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

type Ctx = {
  selectedUserId?: number;
  setSelectedUserId: (id?: number) => void;
  scrollToId: (id: string) => void;
};

const SelectedUserContext = createContext<Ctx | null>(null);

export function MainContextProvider({ children }: PropsWithChildren) {
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>();
  
  const scrollToId = useCallback((id: string) => {
    if (typeof window === "undefined") return;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    } else {
      window.location.hash = `#${id}`;
    }
  }, []);

  const value = useMemo(
    () => ({ selectedUserId, setSelectedUserId, scrollToId }),
    [selectedUserId, scrollToId]
  );

  return (
    <SelectedUserContext.Provider value={value}>
      {children}
    </SelectedUserContext.Provider>
  );
}

export function useMainContext() {
  const ctx = useContext(SelectedUserContext);
  if (!ctx)
    throw new Error("useSelectedUser must be used within SelectedUserProvider");
  return ctx;
}
