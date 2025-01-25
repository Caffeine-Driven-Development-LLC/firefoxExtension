import { useEffect, useState } from 'react'
import Age_indicator from './age_indicator.js'

export default function ({ jobAd }) {
    const [metaData, setMetaData] = useState({
        firstSeen: new Date().getTime(),
    })

    useEffect(() => {
        browser.runtime
            .sendMessage({ type: 'getMetadata', href: jobAd.href })
            .then((metaData) => {
                setMetaData(metaData)
            })
    }, [])

    return (
        <li>
            <Age_indicator firstSeenTimestamp={metaData.firstSeen} />
            <a href={jobAd.href}>{jobAd.innerText}</a>
        </li>
    )
}
