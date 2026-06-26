import { useState } from "react";
import { headUrl } from "../../utils/format";

interface PlayerHeadProps {
  /** UUID (preferred) or player name. */
  id: string;
  size?: number;
  alt?: string;
}

export function PlayerHead({ id, size = 40, alt = "" }: PlayerHeadProps) {
  const [failed, setFailed] = useState(false);
  if (failed || !id) {
    return (
      <span
        className="head"
        aria-hidden
        style={{
          width: size,
          height: size,
          display: "inline-block",
          background:
            "linear-gradient(135deg, var(--surface-3), var(--surface-2))",
        }}
      />
    );
  }
  return (
    <img
      className="head"
      src={headUrl(id, size * 2)}
      width={size}
      height={size}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
