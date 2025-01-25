let db

export function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('JobHrefs', 3)

        request.onerror = function (event) {
            console.log('Error opening database')
            reject(event)
        }

        request.onsuccess = function (event) {
            db = event.target.result
            console.log('Database opened')
            resolve()
        }

        request.onupgradeneeded = function (event) {
            console.log('Database upgrade needed')
            db = event.target.result

            if (!db.objectStoreNames.contains('jobAds')) {
                db.createObjectStore('jobAds')
                console.log('Database setup complete')
            }

            if (!db.objectStoreNames.contains('bookmarks')) {
                db.createObjectStore('bookmarks')
                console.log('Database setup complete')
            }
        }
    })
}

export function saveJobAdMetadata(href, metadata) {
    return new Promise((resolve) => {
        const transaction = db.transaction(['jobAds'], 'readwrite')
        const store = transaction.objectStore('jobAds')
        store.add(metadata, href)
        resolve()
    })
}

export function selectJobAdMetadata(href) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['jobAds'], 'readonly')
        const store = transaction.objectStore('jobAds')
        const request = store.get(href)
        request.onsuccess = function (event) {
            resolve(event.target.result)
        }

        request.onerror = function (event) {
            reject(event)
        }
    })
}

export function createBookmark(payload) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['bookmarks'], 'readwrite')
        const store = transaction.objectStore('bookmarks')
        const payloadToSave = {
            ...payload,
            createdDate: new Date().toISOString(),
        }
        store.add(payloadToSave, payloadToSave.href)
        resolve()
    })
}

export function deleteBookmark(url) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['bookmarks'], 'readwrite')
        const store = transaction.objectStore('bookmarks')
        store.delete(url)
        resolve()
    })
}

export function selectBookmark(url) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['bookmarks'], 'readwrite')
        const store = transaction.objectStore('bookmarks')
        const request = store.get(url)
        request.onsuccess = function (event) {
            resolve(event.target.result)
        }

        request.onerror = function (event) {
            reject(event)
        }
    })
}

export function selectAllBookmarks() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['bookmarks'], 'readwrite')
        const store = transaction.objectStore('bookmarks')
        const request = store.getAll()
        request.onsuccess = function (event) {
            resolve(event.target.result)
        }

        request.onerror = function (event) {
            reject(event)
        }
    })
}
