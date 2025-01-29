import {
    getAllBookmarks,
    getBookmarkByUrl,
    toggleBookmark,
} from './service/bookmark_service.js'
import {
    deleteKnownUrl,
    openDatabase,
    saveKnownUrl,
    selectAllKnownUrl,
    selectJobAdMetadata, selectKnownUrl,
} from './dao/index_db_client.js'
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
                type: 'startProcessingDocument',
            })
            break
        case 'isKnownUrl':
            console.log('checking if known url, ' + message.payload)
            selectKnownUrl(message.payload)
                .then((response) => {
                    console.log('isKnownUrl response: ' + response)
                    sendResponse(typeof response !== 'undefined')
                })
            break
        case 'addKnownUrl':
            console.log('adding known url, ' + message.payload)
            saveKnownUrl(message.payload)
                .then(() => sendResponse(true))
            break
        case 'removeKnownUrl':
            console.log('removing known url, ' + message.payload)
            deleteKnownUrl(message.payload)
                .then(() => sendResponse(true))
            break
        case 'getKnownUrls':
            console.log('getting known urls')
            selectAllKnownUrl().then((urls) => sendResponse(urls))
            break
        default:
            console.log(`Unknown message type: ${message.type}`)
    }

    return true
})

openDatabase()
