import {
    createBookmark,
    selectBookmark,
    deleteBookmark,
    selectAllBookmarks,
} from '../dao/index_db_client.js'

export async function toggleBookmark(payload) {
    return validateBookmark(payload)
        .then(() => {
            return selectBookmark(payload.href)
        })
        .then((bookmark) => {
            return bookmark
                ? deleteBookmark(bookmark.href)
                : createBookmark(payload)
        })
}

export async function getBookmarkByUrl(url) {
    return selectBookmark(url)
}

export async function getAllBookmarks() {
    return selectAllBookmarks()
}

async function validateBookmark(payload) {
    return new Promise((resolve, reject) => {
        if (!payload.href) {
            reject('No href provided for bookmark')
        }
        if (!payload.innerText) {
            reject('No title provided for bookmark')
        }

        resolve()
    })
}
