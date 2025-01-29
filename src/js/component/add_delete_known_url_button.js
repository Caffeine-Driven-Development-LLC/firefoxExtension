import React, { useEffect } from 'react'

export default function Add_delete_known_url_button() {
    const [isKnownUrl, setIsKnownUrl] = React.useState(false)

    function handleClick() {
        browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {

            const url = new URL(tabs[0].url)
            const domainAndPath = `${url.hostname}${url.pathname}`

            const type = isKnownUrl ? 'removeKnownUrl' : 'addKnownUrl'

            browser.runtime.sendMessage({
                tabId: tabs[0].id,
                type: type,
                payload: domainAndPath
            }).then(() => {
                console.log('setting isKnownUrl to ', !isKnownUrl, ' for ', domainAndPath)
                setIsKnownUrl(!isKnownUrl)
            });
        });
    }

    useEffect(() => {
        browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {

            const url = new URL(tabs[0].url)
            const domainAndPath = `${url.hostname}${url.pathname}`
            
            browser.runtime.sendMessage({
                tabId: tabs[0].id,
                type: 'isKnownUrl',
                payload: domainAndPath
            }).then((isKnownUrl) => {
                console.log('setting isKnownUrl to ', isKnownUrl, ' for ', domainAndPath)
                setIsKnownUrl(isKnownUrl)
            });
        });
    }, [])

    return <button onClick={handleClick}>{isKnownUrl ? 'delete' : 'add'} Known Url</button>
}