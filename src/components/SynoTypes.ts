export interface Hit {
    score: number;
    fs_size: number;
    path: string;
    extension: string;
}

export interface SearchResults {
    hits: Hit[];
    total_hits: number;
}
