export default function (payload) {
    payload.anchorTags = payload.anchorTags.map((tag) => {
        const href = tag.href
        // remove all parameters from the href except for jobListingId
        const url = new URL(href)
        const searchParams = url.searchParams
        const jobListingId = searchParams.get('jobListingId')
        const newUrl = `${url.origin}${url.pathname}?jobListingId=${jobListingId}`

        return {
            href: newUrl,
            innerText: tag.innerText,
        }
    })
}
