"use client";
import { useState } from "react";
import { FaPlay } from "react-icons/fa6";
import styles from "@/app/_styles/Thumbnail.module.scss";
import Image from "next/image";

function Thumbnail({ thumbnailUrl, onClick }: { thumbnailUrl: string; onClick?: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div className={styles.thumbnail}>
      <Image
        src={thumbnailUrl}
        alt="Youtube Thumbnail"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        fill
        quality={75}
        sizes="(max-width: 768px) 100vw, 10vw"
      />
      <FaPlay className={isHovered ? styles.hovered : ""} />
    </div>
  );
}

export default Thumbnail;
