import Scene from './scene';
import { MathUtils } from "three";
import QRCode from "react-qr-code";
import { useEffect, useState } from "react";

export default function App(props) {
    const [id, setId] = useState(localStorage.getItem('remote-id'));
    const [url, setUrl] = useState("");
    
    const refreshId = () => {
        const newId = MathUtils.randInt(4096, 65535).toString(16).toUpperCase();
        localStorage.setItem('remote-id', newId);
        setId(newId);
    };
    
    if (id === null)
        refreshId();

	useEffect(() => {
		const loop = setInterval(() => {
			fetch('http://localhost:3030/api/url').then(res => res.json()).then(data => {
				if (url != data.url) {
					setUrl(data.url);
					console.log(data.url);
				}
			});
		}, 10000);

        return () => clearInterval(loop);
	})

    return(
        <>
            <div id="overlay">
				<QRCode value={url} />
                {/* <span>{id}</span> */}
                {/* <button onClick={refreshId} >Refresh</button> */}
            </div>
            <Scene remoteId={id} />
        </>
    )
}
