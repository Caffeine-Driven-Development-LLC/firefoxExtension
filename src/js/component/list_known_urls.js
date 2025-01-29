import { useEffect, useState } from 'react'

export default function ListKnownUrls() {
    const [knownUrls, setKnownUrls] = useState([])

    function del(url) {
        browser.runtime.sendMessage({
            type: 'removeKnownUrl',
            payload: url
        }).then(getKnownUrls);
    }

    function getKnownUrls() {
        browser.runtime
            .sendMessage({
                type: 'getKnownUrls',
            })
            .then(setKnownUrls)
    }

    useEffect(() => {
        getKnownUrls()
    }, [])

    return (
        <>
            <ul>
                {knownUrls.map((url) => (
                    <li key={url}>
                        <button onClick={() => del(url)}>
                            del
                        </button>
                        {url}
                    </li>
                ))}
            </ul>
        </>
    )
}