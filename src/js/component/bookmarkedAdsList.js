import { useEffect, useState } from 'react'
import BookmarkedAdListItem from './bookmarked_ad_list_item.js'

export default function(){
    const [bookmarkedAds, setBookmarkedAds] = useState([])

    useEffect(() => {
        browser.runtime.sendMessage({ type: 'getAllBookmarks' }).then((bookmarks) => {
            setBookmarkedAds(bookmarks)
        })
    }, [])

    return (
        <div>
            <h1>Bookmarked Ads:</h1>
            <ul>
                {bookmarkedAds.map((ad, index) => <BookmarkedAdListItem key={index} jobAd={ad} /> )}
            </ul>
        </div>
    )
}