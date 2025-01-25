import { addMetadataToHyperlinks } from './service/hyperlink_mutation_service.js'

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('message received, type = ', message.type)
    if (message && message.type === 'startProcessingDocument') {
        console.log('processing document')
        processDocument()
            .then(() => sendResponse({ status: 'success' }))
            .catch((error) =>
                sendResponse({ status: 'error', error: error.message })
            )
        return true
    }
})

const jobAdAnchorTagsAndMetadata = new Map()

function getAllAnchorTags() {
    return Array.from(document.getElementsByTagName('a'))
}

function getUnclassifiedTags() {
    const allAnchorTags = getAllAnchorTags()
    return allAnchorTags.filter((tag) => {
        return !jobAdAnchorTagsAndMetadata.has(tag.href)
    })
}

function buildClassificationRequest(unclassifiedTags) {
    const currentUrl = window.location.href
    const payload = {
        referringUrl: currentUrl,
        anchorTags: unclassifiedTags.map((tag) => ({
            href: tag.href,
            innerText: tag.innerText,
        })),
    }
    return {
        type: 'predictJobAds',
        payload: payload,
    }
}

async function processDocument() {
    return new Promise((resolve, reject) => {
        const unclassifiedTags = getUnclassifiedTags()

        if (unclassifiedTags.length === 0) {
            resolve()
        }

        let classificationRequest = buildClassificationRequest(unclassifiedTags)

        browser.runtime
            .sendMessage(classificationRequest)
            .then((predictions) => {
                predictions.forEach((prediction) => {
                    const tag = unclassifiedTags.shift()
                    if (prediction.isJobAd) {
                        jobAdAnchorTagsAndMetadata.set(tag.href, {
                            metadata: prediction.jobAdMetadata,
                        })
                    }
                })
            })
            .then(() => {
                getAllAnchorTags().filter((tag) => {
                    return jobAdAnchorTagsAndMetadata.has(tag.href)
                }).forEach((tag) => {
                    addMetadataToHyperlinks(tag, jobAdAnchorTagsAndMetadata.get(tag.href).metadata)
                })
            })
            .then(() => {
                resolve()
            })
            .catch((error) => {
                console.error('Error during document processing:', error)
                new Promise((resolve) => setTimeout(resolve, 100)).then(() => {
                    queue.queueRun()
                    reject()
                })
            })
    })
}
