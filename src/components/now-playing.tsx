"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Play, SkipForward, SkipBack, Pause } from "lucide-react";
import { useEffect, useState } from "react";
import { BackendClient } from "@/lib/request";
import { isErrorResponse, MusicResponse } from "@/types/request";
import { useAlertContext } from "./provider/alert-provider";
import { useLoadingContext } from "./provider/loading-provider";
import Image from "next/image";
import { io } from "socket.io-client";

export function NowPlaying() {
  const client = new BackendClient();
  const setAlert = useAlertContext();
  const setLoading = useLoadingContext();
  const [nowPlaying, setNowPlaying] = useState<MusicResponse>();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const fetchData = async () => {
    const response = await client.getNowPlaying();

    if (isErrorResponse(response)) {
      setLoading(false);
      setAlert("ผิดพลาด", response.message, 0, true);
      return;
    }
    setNowPlaying(response);

    const isPlayingRes = await client.getIsPlaying();
    if (isErrorResponse(isPlayingRes)) {
      setLoading(false);
      setAlert("ผิดพลาด", isPlayingRes.message, 0, true);
      return;
    }
    setIsPlaying(isPlayingRes.is_playing);

    if (
      response?.info?.durationInMillis &&
      response?.info?.currentPlaybackTime
    ) {
      setProgress(
        (response.info.currentPlaybackTime /
          (response.info.durationInMillis / 1000)) *
          100
      );
    }
  };

  useEffect(() => {
    fetchData();

    const socket = io(process.env.NEXT_PUBLIC_BACKEND_PATH, {
      transports: ["websocket"],
      path: "/socket.io/",
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("API:Playback", (message) => {
      if (message.type != "playbackStatus.playbackTimeDidChange") {
        window.location.reload();
      } else {
        setProgress(
          (message.data.currentPlaybackTime /
            message.data.currentPlaybackDuration) *
            100
        );
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPlayOrPause = async () => {
    await client.actionTogglePlayPause();
  };

  const onNextSong = async () => {
    await client.actionNextSong();
  };

  const onPreviousSong = async () => {
    await client.actionPreviousSong();
  };

  return (
    <Card className="w-full rounded-md border-t p-4 flex items-center gap-4 flex-col sm:flex-row">
      <div className="flex gap-4 w-full">
        {nowPlaying?.info?.artwork?.url ? (
          <Image
            src={nowPlaying?.info?.artwork?.url ?? ""}
            alt="Album Cover"
            width={80}
            height={80}
            className="h-20 w-20 object-cover rounded-sm"
          />
        ) : (
          <div className="w-full h-full bg-gray-200"></div>
        )}

        <div className="flex-1">
          <h3 className="text-lg font-semibold">{nowPlaying?.info?.name}</h3>
          <p className="text-sm text-gray-400">
            {nowPlaying?.info?.artistName}
          </p>
          <Progress value={progress} className="mt-2" />
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="ghost" size="icon" onClick={onPreviousSong}>
          <SkipBack className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onPlayOrPause}>
          {isPlaying ?? false ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6" />
          )}
        </Button>
        <Button variant="ghost" size="icon" onClick={onNextSong}>
          <SkipForward className="w-5 h-5" />
        </Button>
      </div>
    </Card>
  );
}
