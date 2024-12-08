"use client";

import Image from "next/image";
import type { ImageProps } from "next/image";
import React, { useState } from "react";
import { type SetOptional } from "type-fest";

const ImageWithFallback = ({
  src = "",
  alt,
  className,
  defaultImage,
  ...props
}: SetOptional<ImageProps, "src"> & {
  defaultImage: React.ReactNode;
}) => {
  const [isFallback, setIsFallback] = useState(false);

  if (src === "" || isFallback) return defaultImage;

  return (
    <Image
      src={src}
      alt={alt}
      onError={() => {
        setIsFallback(true);
      }}
      unoptimized
      className={className}
      {...props}
    />
  );
};

export default ImageWithFallback;
