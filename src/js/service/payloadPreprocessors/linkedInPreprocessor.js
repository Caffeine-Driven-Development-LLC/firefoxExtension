export default function(payload){
    payload.anchorTags = payload.anchorTags.map((tag) => {
        const href = tag.href
        // remove all parameters from the href except for currentJobId and companyId
        const url = new URL(href)
        const searchParams = url.searchParams
        const currentJobId = searchParams.get('currentJobId')
        const companyId = searchParams.get('companyId')
        const newUrl = `${url.origin}${url.pathname}?currentJobId=${currentJobId}&companyId=${companyId}`

        return {
            href: newUrl,
            innerText: tag.innerText,
        }
    })
}