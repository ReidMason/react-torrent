import React, { useContext, useState } from 'react';
import { useHistory } from "react-router-dom";
import { GlobalContext } from '../GlobalContext';


export default function Dashboard() {
    const { qbittorrentService } = useContext(GlobalContext);
    const [torrents, setTorrents] = useState([{ name: "test" }, { name: "test2" }]);

    const history = useHistory();

    const logOut = () => {
        qbittorrentService.logout();
        history.push('/login');
    }

    return (
        <div>
            <h1>Welcome to the dashboard</h1>
            <button className="bg-blue-500 p-2 rounded w-64" onClick={logOut}>Log out</button>

            <div className="">

            </div>
        </div>
    )
}
