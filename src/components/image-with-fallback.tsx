"use client";

import Image from "next/image";
import type { ImageProps } from "next/image";
import { useState } from "react";

import { cn } from "~/lib/utils";

const ImageWithFallback = ({
  src,
  alt,
  width,
  height,
  className,
  defaultSrc,
  defaultClassName,
  ...props
}: Omit<ImageProps, "src"> & {
  src: ImageProps["src"] | undefined;
  defaultSrc: string;
  defaultClassName?: string;
}) => {
  const [isFallback, setIsFallback] = useState(false);

  return (
    <>
      {src && !isFallback ? (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          onError={() => {
            setIsFallback(true);
          }}
          unoptimized
          className={className}
          {...props}
        />
      ) : (
        <Image
          src={defaultSrc}
          alt={alt}
          width={width}
          height={height}
          unoptimized
          className={cn(defaultClassName, className)}
          {...props}
        />
      )}
    </>
  );
};

export default ImageWithFallback;
