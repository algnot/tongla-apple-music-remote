export interface ErrorResponse {
    status: boolean;
    message: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isErrorResponse = (data: any): data is ErrorResponse => {
    return typeof data.status === "boolean" && typeof data.message === "string";
};

export interface Artwork {
    width: number;
    url: string;
    height: number;
    textColor1: string;
    textColor2: string;
    textColor3: string;
    textColor4: string;
    bgColor: string;
    hasP3: boolean;
};

export interface PlayParams {
    id: string;
    kind: string;
    isLibrary: boolean;
    reporting: boolean;
    catalogId: string;
    reportingId: string;
};

export interface TrackInfo {
    discNumber: number;
    albumName: string;
    genreNames: string[];
    hasLyrics: boolean;
    trackNumber: number;
    releaseDate: string;
    durationInMillis: number;
    name: string;
    artistName: string;
    artwork: Artwork;
    playParams: PlayParams;
    isrc: string;
    currentPlaybackTime: number;
    remainingTime: number;
    inFavorites: boolean;
    inLibrary: boolean;
    shuffleMode: number;
    repeatMode: number;
};

export interface MusicResponse {
    status: string;
    info: TrackInfo;
};

export interface IsPlayingResponse {
    status: string;
    is_playing: boolean;
};

export interface PlayParams {
    id: string;
    kind: string;
}

export interface SongAttributes {
    name: string;
    albumName: string;
    artistName: string;
    artwork: Artwork;
    url: string;
    playParams: PlayParams;
}

export interface SongContent {
    id: string;
    type: string;
    href: string;
    attributes: SongAttributes;
    meta?: {
        contentVersion: Record<string, number>;
    };
}

export interface Suggestion {
    kind: string;
    searchTerm?: string;
    displayTerm?: string;
    content?: SongContent;
}

export interface Results {
    suggestions: Suggestion[];
}

export interface Meta {
    metrics: {
        dataSetId: string;
    };
}

export interface SearchSongResponse {
    results: Results;
    meta: Meta;
}
