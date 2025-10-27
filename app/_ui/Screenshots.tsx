"use client";

import { useState } from "react";
import { Screenshot } from "../_lib/types";
import Heading from "./Heading";
import Modal from "./Modal";
import { SCREENSHOT_HUGE_URL, SCREENSHOT_MED_URL } from "../_lib/env.client";
import styles from "@/app/_styles/Screenshots.module.scss";
import Image from "next/image";
import ImageGallery from "./ImageGallery";

function Screenshots({ screenshots }: { screenshots: Screenshot[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const imageUrls = screenshots.map((s) => `${SCREENSHOT_HUGE_URL + s.image_id}.jpg`);

  return (
    <>
      <Heading as="h3">Screenshots (click to enlarge)</Heading>
      <div className={styles.screenshots}>
        <Modal>
          {screenshots.map((s, i) => (
            <Modal.Open
              key={s.id}
              opens="screenshots"
              renderItem={(open) => (
                <div className={styles.image}>
                  <Image
                    onClick={() => {
                      setSelectedIndex(i);
                      open();
                    }}
                    src={`${SCREENSHOT_MED_URL + s.image_id}.jpg`}
                    alt="Screenshot"
                    fill
                    quality={75}
                    sizes="(max-width: 768px) 100vw, 10vw"
                  />
                </div>
              )}
            />
          ))}
          <Modal.Window
            name="screenshots"
            renderItem={() => <ImageGallery images={imageUrls} startIndex={selectedIndex} />}
          />
        </Modal>
      </div>
    </>
  );
}

export default Screenshots;
