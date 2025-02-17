import axios, { AxiosInstance } from "axios";
import { ErrorResponse, IsPlayingResponse, MusicResponse, Queue, SearchSongResponse } from "@/types/request";

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

    async searchSong(searchString: string): Promise<SearchSongResponse | ErrorResponse> {
        try {
            const response = await client.post("/api/v1/amapi/run-v3", {
                "path": `/v1/catalog/th/search/suggestions?l=en-GB&platform=web&art%5Burl%5D=f&term=${searchString}&fields%5Balbums%5D=artwork%2Cname%2CplayParams%2Curl%2CartistName%2Cid%2CcontentRating&fields%5Bartists%5D=url%2Cname%2Cartwork%2Cid&fields%5Bsongs%5D=artwork%2Cname%2CplayParams%2Curl%2CartistName%2Cid%2CcontentRating%2CalbumName&kinds=terms%2CtopResults&limit%5Bresults%3Aterms%5D=1&limit%5Bresults%3AtopResults%5D=10&omit%5Bresource%5D=autos&types=activities%2Calbums%2Cartists%2Ceditorial-items%2Cmusic-movies%2Cplaylists%2Crecord-labels%2Csongs%2Cstations`
            });
            return response.data.data;
        } catch (e) {
            return handlerError(e);
        }
    }

    async getQueue(): Promise<Queue[] | ErrorResponse> {
        try {
            const response = await client.get("/api/v1/playback/queue");
            return response.data;
        } catch (e) {
            return handlerError(e);
        }
    }
}