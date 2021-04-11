import { createContext } from "react";
import QbittorrentService from "./services/qbittorrent";

interface GlobalContext {
    authenticated: boolean | null,
    setAuthenticated: Function,
    qbittorrentService: QbittorrentService
}

export const GlobalContext = createContext({} as GlobalContext);