import React, { useContext, useEffect, useState, useRef, forwardRef } from 'react';
import BulkTorrentActions from '../components/BulkTorrentActions';
import SButton from '../components/SButton';
import SortTorrentMenu from '../components/SortTorrentMenu';
import TorrentListItem, { TorrentListItemProps } from '../components/TorrentListItem';
import { GlobalContext } from '../GlobalContext';
import Torrent from "../interfaces/Torrent";
import TorrentFilterParams from '../interfaces/TorrentFilterParams';
import FlipMove from 'react-flip-move'
import GlobalTranserInfoDisplay from '../components/GlobalTranserInfoDisplay';
import Maindata, { NewMaindata } from '../interfaces/Maindata';
import { bytesToSize } from '../utils';
import { Transition } from 'react-transition-group';
import LoadingSpinner from '../components/LoadingSpinner';

const FunctionalTorrentListItem = forwardRef((props: TorrentListItemProps, ref: any) => (
    <div ref={ref}>
        <TorrentListItem {...props} />
    </div>
));

const initialEnterAnimation = {
    from: {
        opacity: '0',
        transform: 'translate(0, 10px)'
    },
    to: {
        opacity: '1',
        transform: 'translate(0, 0)'
    }
};

export default function TorrentsList() {
    const { qbittorrentService } = useContext(GlobalContext);
    const [torrents, setTorrents] = useState<Array<Torrent>>([]);
    const [maindata, setMaindata] = useState<Maindata>();

    const [torrentFilterParams, setTorrentFilterParams] = useState<TorrentFilterParams>(JSON.parse(localStorage.getItem("filterParams") ?? "{}"));
    const [torrentsLoaded, setTorrentsLoaded] = useState<boolean>(false);
    const selectedTorrentHashes = useRef<Array<string>>([]);

    const setTorrentSort = (newSort: string) => {
        torrentFilterParams.sort = newSort;
        updateFilterParams(torrentFilterParams);
    }

    const updateFilterParams = (newTorrentFilterParams: TorrentFilterParams) => {
        setTorrentFilterParams({ ...newTorrentFilterParams })
        localStorage.setItem("filterParams", JSON.stringify(newTorrentFilterParams));
    }

    const setTorrent = (torrent: Torrent) => {
        // Update the torrent in the torrents list
        const targetTorrentIndex = torrents.findIndex(x => x.hash === torrent.hash);
        torrents[targetTorrentIndex] = torrent;

        // Update the selectedTorrentsHashes list in case the selected state has changed 
        const selectedTorrents = torrents.filter((x) => x.selected);
        selectedTorrentHashes.current = selectedTorrents.map((x) => x.hash);

        setTorrents([...torrents]);
    }

    useEffect(() => {
        // Setup promises
        const torrentsPromise = qbittorrentService.getTorrents(torrentFilterParams);
        const maindataPromise = qbittorrentService.getMaindata(0);

        Promise.all([torrentsPromise, maindataPromise]).then((responses) => {
            // --- Handle torrents response
            const torrentsResponse = responses[0];
            setTorrents(torrentsResponse.data);

            // --- handle maindata response
            const maindataResponse = responses[1];
            const newMaindata: Maindata = maindataResponse.data;
            setMaindata(newMaindata);

            // Set the flag for torrents being loaded
            // This is used to change the animation used and signaling components to display
            setTorrentsLoaded(true);

        })
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            // Setup promises
            const torrentsPromise = qbittorrentService.getTorrents(torrentFilterParams);
            const maindataPromise = qbittorrentService.getMaindata(maindata!.rid);

            Promise.all([torrentsPromise, maindataPromise]).then((responses) => {
                // --- Handle torrents response
                const torrentsResponse = responses[0];
                let newTorrentData = torrentsResponse.data
                // Remove any selected torrent hashes of torrents that no longer exist
                const allHashes = newTorrentData.map((x: Torrent) => x.hash);
                selectedTorrentHashes.current = selectedTorrentHashes.current.filter((x) => allHashes.includes(x));

                // Set the selected value for the torrents
                newTorrentData = newTorrentData.map((x: Torrent) => {
                    x.selected = selectedTorrentHashes.current.includes(x.hash);
                    return x;
                })

                setTorrents(newTorrentData);

                // --- handle maindata response
                const maindataResponse = responses[1].data;
                const newMaindata: NewMaindata = maindataResponse;
                maindata!.rid = newMaindata.rid;
                if (maindata && newMaindata.server_state) {
                    const propsToUpdate: Array<"free_space_on_disk" | "alltime_dl" | "alltime_ul" | "dl_info_speed" | "up_info_speed"> = ["free_space_on_disk", "alltime_dl", "alltime_ul", "dl_info_speed", "up_info_speed"];
                    propsToUpdate.map((prop) => {
                        if (newMaindata.server_state![prop])
                            maindata.server_state[prop] = newMaindata.server_state![prop]!;
                    })
                }
                setMaindata({ ...maindata! });

            })
        }, 1500);
        return () => clearInterval(interval);
    }, [qbittorrentService, torrentFilterParams, selectedTorrentHashes, maindata]);

    const deselectAllTorrents = () => {
        selectedTorrentHashes.current = [];
        torrents.forEach(x => { x.selected = false });
        setTorrents([...torrents]);
    }

    const selectAllTorrents = () => {
        selectedTorrentHashes.current = torrents.map(x => (x.hash));
        torrents.forEach(x => { x.selected = true });
        setTorrents([...torrents]);
    }

    return (
        <div className="flex flex-col gap-4">
            <div className={`flex flex-col gap-4 transition duration-300 ${torrentsLoaded ? "opacity-100" : "opacity-0"}`}>
                <div className="w-80">
                    <GlobalTranserInfoDisplay maindata={maindata!} />
                </div>
                <div className="flex justify-between">
                    <SortTorrentMenu sort={torrentFilterParams.sort} setSort={setTorrentSort} />
                    <div className="flex items-end gap-4">
                        <div className={`transition duration-150 ${selectedTorrentHashes.current.length > 0 ? "opacity-100" : "opacity-0"}`}>
                            <BulkTorrentActions torrentHashes={selectedTorrentHashes.current} deselectAllTorrents={deselectAllTorrents} />
                        </div>

                        <SButton onClick={selectAllTorrents}>Select all</SButton>
                    </div>
                </div>
            </div>

            <FlipMove className="flex flex-col gap-2" enterAnimation={torrentsLoaded ? "fade" : initialEnterAnimation} leaveAnimation="fade" staggerDelayBy={50}>
                {torrents.map((torrent) => (
                    <FunctionalTorrentListItem key={torrent.hash} torrent={torrent} setTorrent={setTorrent} />
                ))}
            </FlipMove>
        </div>
    )
}
