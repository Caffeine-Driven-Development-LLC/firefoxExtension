import { useEffect, useState } from 'react'

export default function ({ href, innerText }) {
    const [isBookmarked, setIsBookmarked] = useState(null)

    useEffect(() => {
        browser.runtime
            .sendMessage({ type: 'getBookmark', payload: href })
            .then((bookmark) => {
                setIsBookmarked(!!bookmark)
            })
    }, [])

    function toggleBookmark(event) {
        event.stopPropagation()
        event.preventDefault()

        if (isBookmarked === null) {
            return
        }

        const payload = {
            href: href,
            innerText: innerText,
        }

        browser.runtime
            .sendMessage({ type: 'toggleBookmark', payload: payload })
            .then(() => {
                setIsBookmarked(!isBookmarked)
            })
    }

    return (
        <svg
            width="13"
            height="15"
            viewBox="0 0 6 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={toggleBookmark}
        >
            <path
                id="Bookmark Icon"
                d="M0.25 7.548V0.25H5.75V7.548L3.13287 5.90588L3 5.82251L2.86713 5.90588L0.25 7.548Z"
                fill={isBookmarked ? '#FBFF3C' : '#c3c3c3'}
                stroke="black"
                strokeWidth="0.5"
            />
        </svg>
    )
}
