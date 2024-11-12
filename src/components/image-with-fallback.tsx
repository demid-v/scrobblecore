"use client";

import Image from "next/image";
import type { ImageProps } from "next/image";
import { useState } from "react";

const ImageWithFallback = ({
  src,
  alt,
  width,
  height,
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
          unoptimized={true}
          width={width}
          height={height}
          onError={() => setIsFallback(true)}
          {...props}
        />
      ) : (
        <Image
          src={defaultSrc}
          alt={alt}
          unoptimized={true}
          width={width}
          height={height}
          className={defaultClassName}
          {...props}
        />
      )}
    </>
  );
};

export default ImageWithFallback;
