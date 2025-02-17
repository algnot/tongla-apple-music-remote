"use client";

import { useAlertContext } from "@/components/provider/alert-provider";
import { useLoadingContext } from "@/components/provider/loading-provider";
import { BackendClient } from "@/lib/request";
import { isErrorResponse, Queue } from "@/types/request";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Page() {
  const client = new BackendClient();
  const [queues, setQueues] = useState<Queue[]>([]);
  const setAlert = useAlertContext();
  const setLoading = useLoadingContext();

  const fetchData = async () => {
    setLoading(true);
    const responseNowPlaying = await client.getNowPlaying();

    if (isErrorResponse(responseNowPlaying)) {
      setLoading(false);
      setAlert("ผิดพลาด", responseNowPlaying.message, 0, true);
      return;
    }

    const response = await client.getQueue();
    setLoading(false);

    if (isErrorResponse(response)) {
      setAlert("ผิดพลาด", response.message, 0, true);
      return;
    }

    const queueList = [];
    let isPlayed = true;
    for (const queue of response) {
      if (!isPlayed) {
        queueList.push(queue);
      }
      if (
        queue.attributes.name == responseNowPlaying.info.name &&
        queue.attributes.artistName == responseNowPlaying.info.artistName &&
        queue.attributes.albumName == responseNowPlaying.info.albumName
      ) {
        isPlayed = false;
      }
    }
    setQueues(queueList);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-1 flex-col p-4 pt-0">
      <div className="font-bold text-xl">Queue</div>
      <div className="max-h-[calc(100vh-200px)] overflow-y-scroll">
        {queues.map((queue, index) => (
          <div key={index} className="flex gap-6 border-b-2 py-2 items-center">
            <Image
              src={(queue?.attributes?.artwork?.url ?? "")
                .replace("{w}", "40")
                .replace("{h}", "40")
                .replace("{f}", "jpg")}
              alt="Artwork"
              width={40}
              height={40}
              className="rounded-md"
            />
            <div className="">
              <div>{queue.attributes?.name ?? "Unknown"}</div>
              <div className="text-gray-400">
                {queue.attributes?.artistName ?? "Unknown"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
