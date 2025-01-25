import {
    getAllBookmarks,
    getBookmarkByUrl,
    toggleBookmark,
} from './service/bookmark_service.js'
import { openDatabase, selectJobAdMetadata } from './dao/index_db_client.js'
import { makePrediction } from './service/ad_prediction_service.js'

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
        case 'toggleBookmark':
            console.log('toggling bookmark, ' + message.payload)
            toggleBookmark(message.payload)
                .then(sendResponse)
                .catch((error) => {
                    console.error('Error during bookmarking:', error)
                })
            break
        case 'getBookmark':
            getBookmarkByUrl(message.payload)
                .then((bookmark) => sendResponse(bookmark))
                .catch((error) => {
                    console.error('Error during bookmark retrieval:', error)
                })
            break
        case 'getAllBookmarks':
            getAllBookmarks()
                .then((bookmarks) => sendResponse(bookmarks))
                .catch((error) => {
                    console.error('Error during bookmark retrieval:', error)
                })
            break
        case 'predictJobAds':
            makePrediction(message.payload)
                .then((predictions) => sendResponse(predictions))
                .catch((error) => {
                    console.error('Error during prediction:', error)
                })
            break
        case 'getMetadata':
            selectJobAdMetadata(message.href).then((metadata) =>
                sendResponse(metadata)
            )
            break
        case 'runTheJob':
            console.log('running the job, tab id ' + message.tabId)
            browser.tabs.sendMessage(message.tabId, {
                type: 'startProcessingDocument'
            })
            break
        default:
            console.log(`Unknown message type: ${message.type}`)
    }

    return true
})

openDatabase()
