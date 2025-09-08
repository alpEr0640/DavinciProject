import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useMainContext } from "@/context/main-context";
import { Button } from "../button";

export default function BackToTop({
  targetId = "index",
  thresholdPx = 300,
}: {
  targetId?: string;
  thresholdPx?: number;
}) {
  const { scrollToId } = useMainContext();
  const [show, setShow] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        setShow(window.scrollY > thresholdPx);
        ticking.current = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [thresholdPx]);

  const handleClick = () => {
    scrollToId(targetId);
  };

  return (
    <div
      className={`fixed z-50 right-4 bottom-4 md:right-6 md:bottom-6
        transition-all duration-500 ease-out
        ${
          show
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-2 scale-95 pointer-events-none"
        }
      `}
    >
      <Button
        size="icon"
        variant="outline"
        aria-label="Yukarı çık"
        aria-controls={targetId}
        onClick={handleClick}
        className="rounded-full shadow-lg size-12"
      >
        <ArrowUp className="size-5" />
      </Button>
    </div>
  );
}
