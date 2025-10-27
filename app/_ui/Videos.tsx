"use client";
import { useState } from "react";
import { Video } from "../_lib/types";
import Heading from "./Heading";
import Modal from "./Modal";
import Thumbnail from "./Thumbnail";
import styles from "@/app/_styles/Videos.module.scss";
import VideoGallery from "./VideoGallery";

function getVideoThumbnail(videoId: string) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

function Videos({ videos }: { videos: Video[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const videoThumbnails = videos.map((v) => getVideoThumbnail(v.videoId));
  const videoIds = videos.map((v) => v.videoId);

  return (
    <>
      <Heading as="h3">Videos</Heading>
      <div className={styles.videos}>
        <Modal>
          {videoThumbnails.map((v, i) => (
            <Modal.Open
              key={v}
              opens="videos"
              renderItem={(open) => (
                <Thumbnail
                  onClick={() => {
                    setSelectedIndex(i);
                    open();
                  }}
                  thumbnailUrl={v}
                />
              )}
            />
          ))}
          <Modal.Window
            name="videos"
            renderItem={() => <VideoGallery videoIds={videoIds} startIndex={selectedIndex} />}
          />
        </Modal>
      </div>
    </>
  );
}

export default Videos;
