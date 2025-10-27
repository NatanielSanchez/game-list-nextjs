import {
  FaApple,
  FaBluesky,
  FaDiscord,
  FaFacebookF,
  FaGlobe,
  FaGooglePlay,
  FaHouse,
  FaInstagram,
  FaItchIo,
  FaMeta,
  FaPlaystation,
  FaRedditAlien,
  FaSteam,
  FaTwitch,
  FaWikipediaW,
  FaXbox,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { SiEpicgames, SiGogdotcom, SiNintendoswitch } from "react-icons/si";
import type { JSX } from "react";
import { Website, WebsiteName } from "../_lib/types";
import styles from "@/app/_styles/Websites.module.scss";
import Link from "next/link";

function Websites({ websites }: { websites?: Website[] }) {
  if (!websites || websites.length === 0) return null;

  return (
    <div className={styles.websites}>
      {websites.map((website) => (
        <Link
          className={styles.link}
          key={website.id}
          href={website.url}
          target="_blank"
          rel="noopener noreferrer"
          title={`Go to ${website.name} page`}
        >
          {getWebsiteIcon(website.name)}
        </Link>
      ))}
    </div>
  );
}

export default Websites;

function getWebsiteIcon(websiteName: WebsiteName): JSX.Element {
  switch (websiteName) {
    case "Community Wiki":
      return <FaGlobe />;
    case "Twitch":
      return <FaTwitch />;
    case "Twitter":
      return <FaXTwitter />;
    case "Wikipedia":
      return <FaWikipediaW />;
    case "Facebook":
      return <FaFacebookF />;
    case "Google Play":
      return <FaGooglePlay />;
    case "Instagram":
      return <FaInstagram />;
    case "Subreddit":
      return <FaRedditAlien />;
    case "Official Website":
      return <FaHouse />;
    case "YouTube":
      return <FaYoutube />;
    case "App Store (iPhone)":
    case "App Store (iPad)":
      return <FaApple />;
    case "Itch":
      return <FaItchIo />;
    case "Steam":
      return <FaSteam />;
    case "Epic":
      return <SiEpicgames />;
    case "GOG":
      return <SiGogdotcom />;
    case "Discord":
      return <FaDiscord />;
    case "Bluesky":
      return <FaBluesky />;
    case "Xbox":
      return <FaXbox />;
    case "Playstation":
      return <FaPlaystation />;
    case "Nintendo":
      return <SiNintendoswitch />;
    case "Meta":
      return <FaMeta />;
  }
}
