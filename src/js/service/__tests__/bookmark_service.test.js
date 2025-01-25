import { expect, jest } from '@jest/globals'

jest.unstable_mockModule('../../dao/index_db_client', () => ({
    createBookmark: jest.fn(),
    selectBookmark: jest.fn(),
    deleteBookmark: jest.fn(),
    selectAllBookmarks: jest.fn(),
}))

const { createBookmark, selectBookmark, deleteBookmark, selectAllBookmarks } =
    await import('../../dao/index_db_client')
const { toggleBookmark, getBookmarkByUrl, getAllBookmarks } = await import(
    '../bookmark_service'
)

describe('bookmark_service', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('toggleBookmark tests', () => {
        it('should not do anything if no href is provided', async () => {
            await expect(toggleBookmark({})).rejects.toEqual(
                'No href provided for bookmark'
            )

            expect(selectBookmark).not.toHaveBeenCalled()
            expect(createBookmark).not.toHaveBeenCalled()
            expect(deleteBookmark).not.toHaveBeenCalled()
        })

        it('should not do anything if no innerText is provided', async () => {
            await expect(
                toggleBookmark({ href: 'https://www.example.com' })
            ).rejects.toEqual('No title provided for bookmark')

            expect(selectBookmark).not.toHaveBeenCalled()
            expect(createBookmark).not.toHaveBeenCalled()
            expect(deleteBookmark).not.toHaveBeenCalled()
        })

        it('should add a bookmark if it does not exist', async () => {
            const payload = {
                href: 'https://www.example.com',
                innerText: 'Example',
            }

            selectBookmark.mockResolvedValue(null) // Simulate bookmark not existing

            await toggleBookmark(payload)

            expect(selectBookmark).toHaveBeenCalledTimes(1)
            expect(createBookmark).toHaveBeenCalledTimes(1)
            expect(deleteBookmark).not.toHaveBeenCalled()

            expect(selectBookmark).toHaveBeenCalledWith(payload.href)
            expect(createBookmark).toHaveBeenCalledWith(payload)
        })

        it('should remove a bookmark if it exists', async () => {
            const payload = {
                href: 'https://www.example.com',
                innerText: 'Example',
            }

            selectBookmark.mockResolvedValue(payload)

            await toggleBookmark(payload)

            expect(selectBookmark).toHaveBeenCalledTimes(1)
            expect(createBookmark).not.toHaveBeenCalled()
            expect(deleteBookmark).toHaveBeenCalledTimes(1)

            expect(selectBookmark).toHaveBeenCalledWith(payload.href)
            expect(deleteBookmark).toHaveBeenCalledWith(payload.href)
        })
    })

    describe('getBookmarkByUrl tests', () => {
        it('should call selectBookmark with the provided url', async () => {
            const url = 'https://www.example.com'

            const date = new Date()
            date.setDate(date.getDate() - 2)

            const expectedBookmark = {
                href: url,
                innerText: 'Example',
                createDate: date.toISOString(),
            }

            // mock response from selectBookmark
            selectBookmark.mockResolvedValue(expectedBookmark)

            const bookmark = await getBookmarkByUrl(url)

            expect(selectBookmark).toHaveBeenCalledTimes(1)
            expect(selectBookmark).toHaveBeenCalledWith(url)

            expect(bookmark).toEqual(expectedBookmark)
        })
    })

    describe('getAllBookmarks tests', () => {
        it('should return all bookmarks', async () => {
            const expectedBookmarks = [
                {
                    href: 'https://www.example.com',
                    innerText: 'Example',
                    createDate: new Date().toISOString(),
                },
                {
                    href: 'https://www.example2.com',
                    innerText: 'Example 2',
                    createDate: new Date().toISOString(),
                },
            ]
            selectAllBookmarks.mockResolvedValue(expectedBookmarks)

            const bookmarks = await getAllBookmarks()

            expect(selectAllBookmarks).toHaveBeenCalledTimes(1)
            expect(bookmarks).toEqual(expectedBookmarks)
        })
    })
})
