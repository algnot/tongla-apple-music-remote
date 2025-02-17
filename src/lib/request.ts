import axios, { AxiosInstance } from "axios";
import { ErrorResponse, IsPlayingResponse, MusicResponse } from "@/types/request";

const handlerError = (error: unknown): ErrorResponse => {
    if (axios.isAxiosError(error)) {
        if (error.response && error.response.data && error.response.data.message) {
            return {
                status: false,
                message: error.response.data.message,
            };
        } else {
            return {
                status: false,
                message: error.message,
            };
        }
    } else {
        return {
            status: false,
            message: "An unknow error occurred. try again!",
        };
    }
};

const client: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_PATH,
    headers: {
        "Content-Type": "application/json",
    },
});

export class BackendClient {
    async getNowPlaying(): Promise<MusicResponse | ErrorResponse> {
        try {
            const response = await client.get("/api/v1/playback/now-playing");
            return response.data;
        } catch (e) {
            return handlerError(e);
        }
    }

    async getIsPlaying(): Promise<IsPlayingResponse | ErrorResponse> {
        try {
            const response = await client.get("/api/v1/playback/is-playing");
            return response.data;
        } catch (e) {
            return handlerError(e);
        }
    }

    async actionTogglePlayPause(): Promise<boolean | ErrorResponse> {
        try {
            const response = await client.post("/api/v1/playback/playpause");
            return response.data;
        } catch (e) {
            return handlerError(e);
        }
    }

    async actionNextSong(): Promise<boolean | ErrorResponse> {
        try {
            const response = await client.post("/api/v1/playback/next");
            return response.data;
        } catch (e) {
            return handlerError(e);
        }
    }

    async actionPreviousSong(): Promise<boolean | ErrorResponse> {
        try {
            const response = await client.post("/api/v1/playback/previous");
            return response.data;
        } catch (e) {
            return handlerError(e);
        }
    }
}