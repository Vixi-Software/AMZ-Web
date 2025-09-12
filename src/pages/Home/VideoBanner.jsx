// src/pages/Home/VideoBanner.jsx
import React, { useEffect, useRef, useState } from "react";
import { Card, Button, Tooltip } from "antd";
import { SoundFilled, MutedOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

function getYouTubeId(url) {
  const regex = /(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([^&#]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function VideoBanner() {
  const home = useSelector(state =>
    state.homeSetting &&
      Array.isArray(state.homeSetting.homeSettings)
      ? state.homeSetting.homeSettings
      : []
  );
  const playerRef = useRef(null);
  const [videoId,setVideoId] = useState(""); // replace with your VIDEO_ID
  const [isMuted, setIsMuted] = useState(true); // start muted for autoplay
  const [tooltipOpen, setTooltipOpen] = useState(true); // 👈 show at start

  useEffect(() => {
    // Hide tooltip after 5 seconds
    setVideoId(getYouTubeId(home[0].youtubeBanner))
    const timer = setTimeout(() => setTooltipOpen(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    } else if (window.YT && window.YT.Player) {
      initPlayer();
    }

    window.onYouTubeIframeAPIReady = initPlayer;

    function initPlayer() {
      if (playerRef.current) {
        playerRef.current.destroy();
      }

      playerRef.current = new window.YT.Player("yt-player", {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          loop: 1,
          mute: 0,
          playlist: videoId,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
        },
        events: {
          onReady: (event) => {
            event.target.mute();
            event.target.playVideo(); // always starts
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              event.target.playVideo(); // force infinite loop
            }
          },
        },
      });
    }

    return () => {
      delete window.onYouTubeIframeAPIReady;
    };
  }, [videoId]);

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.unMute();
    } else {
      playerRef.current.mute();
    }
    setIsMuted(!isMuted);
  };

  return (
    <div className="w-full mt-2 md:mt-0 relative">
      <Card
        bordered={false}
        className="rounded-lg overflow-hidden shadow-md"
        bodyStyle={{ padding: 0 }}
      >
        <div className="relative">
          {/* YouTube Video */}
          <div
            id="yt-player"
            className="
              w-full object-cover
              h-[180px]
              md:h-[400px]
              lg:h-[560px]
              rounded-lg
              pointer-events-none
            "
          ></div>

          {/* Floating Mute/Unmute Button */}
          <Tooltip title={isMuted ? "Nhấn để bật âm" : "Nhấn để tắt âm"}
            open={tooltipOpen}
            defaultOpen
          >
            <Button
              onClick={toggleMute}
              className="!absolute !bottom-4 !left-4 pointer-events-auto border-none"
              style={{
                backgroundColor: "rgba(0,0,0,0.5)",     // normal
                color: "#fff",                           // icon color
                border: "none",
              }}
              shape="circle"
              type="default"
              size="large"
              icon={isMuted ? <MutedOutlined /> : <SoundFilled />}
            />
          </Tooltip>
        </div>
      </Card>
    </div>
  );
}

export default VideoBanner;
