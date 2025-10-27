"use client";
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from "react-icons/md";
import { useState } from "react";
import { FaYoutube } from "react-icons/fa6";
import styles from "@/app/_styles/VideoGallery.module.scss";

function getVideoEmbedUrl(videoId: string) {
  return `https://www.youtube.com/embed/${videoId}`;
}

function getVideoUrl(videoId: string) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

function VideoGallery({ videoIds, startIndex }: { videoIds: string[]; startIndex?: number }) {
  const [index, setIndex] = useState(startIndex && startIndex >= 0 && startIndex < videoIds.length ? startIndex : 0);
  const [isLoadingVideo, setIsLoadingVideo] = useState(true);

  function dec() {
    setIndex((index) => (index > 0 ? index - 1 : index));
    setIsLoadingVideo(true);
  }

  function inc() {
    setIndex((index) => (index < videoIds.length - 1 ? index + 1 : index));
    setIsLoadingVideo(true);
  }
  return (
    <>
      <div className={styles.gallery}>
        <button className={styles.arrowButton} onClick={dec} disabled={index === 0}>
          <MdOutlineArrowBackIos />
        </button>
        <iframe
          className={`${styles.video} ${isLoadingVideo ? styles.grayscale : ""}`}
          src={getVideoEmbedUrl(videoIds[index])}
          allowFullScreen
          onLoad={() => setIsLoadingVideo(false)}
        />
        <button className={styles.arrowButton} onClick={inc} disabled={index === videoIds.length - 1}>
          <MdOutlineArrowForwardIos />
        </button>
      </div>
      <p className={styles.text}>
        <a href={getVideoUrl(videoIds[index])}>
          <FaYoutube />
          Watch on Youtube
        </a>
        {index + 1} / {videoIds.length}
      </p>
    </>
  );
}

export default VideoGallery;
