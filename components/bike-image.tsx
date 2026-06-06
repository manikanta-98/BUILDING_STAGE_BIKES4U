"use client";

import { useEffect, useState } from "react";
import { PLACEHOLDER } from "@/lib/bike-helpers";

interface BikeImageProps {
  src: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
}

export function BikeImage({ src, alt, className, onLoad }: BikeImageProps) {
  const [current, setCurrent] = useState(src || PLACEHOLDER);

  useEffect(() => {
    setCurrent(src || PLACEHOLDER);
  }, [src]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current || PLACEHOLDER}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onLoad={onLoad}
      onError={() => {
        setCurrent((prev) => (prev === PLACEHOLDER ? prev : PLACEHOLDER));
        onLoad?.();
      }}
    />
  );
}
