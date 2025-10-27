"use client";
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from "react-icons/md";
import { useState } from "react";
import styles from "@/app/_styles/ImageGallery.module.scss";
import Image from "next/image";

function ImageGallery({ images, startIndex }: { images: string[]; startIndex?: number }) {
  const [index, setIndex] = useState(startIndex && startIndex >= 0 && startIndex < images.length ? startIndex : 0);
  const [isLoadingImg, setIsLoadingImg] = useState(true);

  function dec() {
    setIndex((index) => (index > 0 ? index - 1 : index));
    setIsLoadingImg(true);
  }

  function inc() {
    setIndex((index) => (index < images.length - 1 ? index + 1 : index));
    setIsLoadingImg(true);
  }

  return (
    <>
      <div className={styles.gallery}>
        <button className={styles.arrowButton} onClick={dec} disabled={index === 0}>
          <MdOutlineArrowBackIos />
        </button>
        <div className={styles.image}>
          <Image
            src={images[index]}
            alt="Screenshot"
            onLoad={() => setIsLoadingImg(false)}
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            className={isLoadingImg ? styles.grayscale : ""}
          />
        </div>

        <button className={styles.arrowButton} onClick={inc} disabled={index === images.length - 1}>
          <MdOutlineArrowForwardIos />
        </button>
      </div>
      <p className={styles.text}>
        {index + 1} / {images.length}
      </p>
    </>
  );
}

export default ImageGallery;
