import { useState, useEffect } from "react";
import ArrowDropUp from "@mui/icons-material/ArrowDropUp";
import ArrowRight from "@mui/icons-material/ArrowRight";

// Dropdown button. If `open` prop is provided the component is controlled and
// will reflect that value; otherwise it manages its own internal open state.
export default function Dropdown({ open: openProp, onClick }) {
  const [open, setOpen] = useState(Boolean(openProp));

  useEffect(() => {
    if (openProp !== undefined) setOpen(Boolean(openProp));
  }, [openProp]);

  const handleClick = () => {
    if (openProp === undefined) setOpen((prev) => !prev);
    if (typeof onClick === "function") onClick();
  };

  return (
    <button className = "dropdown" type="button" onClick={handleClick} aria-pressed={open} aria-label={open ? "Collapse" : "Expand"}>
      {open ? <ArrowRight /> : <ArrowDropUp />}
    </button>
  );
}