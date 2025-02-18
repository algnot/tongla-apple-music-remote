"use client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { BackendClient } from "@/lib/request";
import { ListStart, ListEnd, X } from "lucide-react";
import Image from "next/image";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

export function AddSongDialogComponent({
  songId,
  songName,
  songArtist,
  songImage,
  onCancel,
}: {
  songId: string;
  songName: string;
  songArtist: string;
  songImage: string;
  onCancel: () => void;
}) {
  const client = new BackendClient();

  const actionPlayNext = async () => {
    await client.playNext(songId, "songs");
    window.location.reload();
  };

  const actionPlayLater = async () => {
    await client.playLater(songId, "songs");
    window.location.reload();
  };

  return (
    <AlertDialog open={songId !== ""}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-5 mb-3">
            <Image
              width={80}
              height={80}
              className="rounded-md"
              alt={songName}
              src={songImage}
            />
            <div>
              <div className="text-xl">{songName}</div>
              <div className="text-gray-400">{songArtist}</div>
            </div>
          </div>
          <div
            className="flex gap-4 p-3 rounded-md hover:bg-primary-foreground cursor-pointer"
            onClick={actionPlayNext}
          >
            <ListStart />
            Play Next
          </div>
          <div
            className="flex gap-4 p-3 rounded-md hover:bg-primary-foreground cursor-pointer"
            onClick={actionPlayLater}
          >
            <ListEnd />
            Play Later
          </div>
          <div
            className="flex gap-4 p-3 rounded-md hover:bg-primary-foreground cursor-pointer"
            onClick={onCancel}
          >
            <X />
            Cancel
          </div>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const AddSongContext = createContext(
  (songId: string, songName: string, songArtist: string, songImage: string) => {
    return [songId, songName, songArtist, songImage];
  }
);

export function AddSongProvider({ children }: { children: ReactNode }) {
  const [songId, setSongId] = useState<string>("");
  const [songName, setSongName] = useState<string>("");
  const [songArtist, setSongArtist] = useState<string>("");
  const [songImage, setSongImage] = useState<string>("");

  const onChangeAlert = useCallback(
    (
      songId: string,
      songName: string,
      songArtist: string,
      songImage: string
    ) => {
      setSongId(songId);
      setSongName(songName);
      setSongArtist(songArtist);
      setSongImage(songImage);
      return [songId, songName, songArtist, songImage];
    },
    []
  );

  const onCancel = () => {
    setSongId("");
    setSongName("");
    setSongArtist("");
    setSongImage("");
  };

  return (
    <AddSongContext.Provider value={onChangeAlert}>
      {songId && (
        <AddSongDialogComponent
          songId={songId}
          songName={songName}
          songArtist={songArtist}
          songImage={songImage}
          onCancel={onCancel}
        />
      )}
      {children}
    </AddSongContext.Provider>
  );
}

export const useAddSongContext = () => useContext(AddSongContext);
