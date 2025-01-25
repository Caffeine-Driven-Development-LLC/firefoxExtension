import { expect, jest } from '@jest/globals'
import StaticQueueableFunction from '../static-queueable-function.js'

let counter = 0

function incrementCounterAfterWait(waitInMs = 1000) {
    return new Promise((resolve) => {
        setTimeout(() => {
            counter++
            resolve()
        }, waitInMs)
    })
}

describe('StaticQueueableFunction tests', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        counter = 0
    })

    it('should execute a function after a delay', async () => {
        const queueableFunction = new StaticQueueableFunction(
            incrementCounterAfterWait,
            1000
        )

        expect(counter).toBe(0)
        await queueableFunction.queueRun()
        expect(counter).toBe(1)
    })

    it('should execute a function immediately if no delay is set', async () => {
        const queueableFunction = new StaticQueueableFunction(
            incrementCounterAfterWait
        )

        const queuedFunction = queueableFunction.queueRun()
        expect(counter).toBe(0)
        await queuedFunction
        expect(counter).toBe(1)
    })

    it('should queue up a single function call', async () => {
        const queueableFunction = new StaticQueueableFunction(
            incrementCounterAfterWait
        )

        expect(counter).toBe(0)
        const firstCall = queueableFunction.queueRun()
        const secondCall = queueableFunction.queueRun()
        const thirdCall = queueableFunction.queueRun()

        expect(secondCall).toEqual(thirdCall)
        expect(counter).toBe(0)

        await firstCall
        expect(counter).toBe(1)

        await secondCall
        expect(counter).toBe(2)
    })

    it('should queue up a single function call with a delay between', async () => {
        const queueableFunction = new StaticQueueableFunction(
            incrementCounterAfterWait,
            100
        )

        expect(counter).toBe(0)
        const firstCall = queueableFunction.queueRun()
        const secondCall = queueableFunction.queueRun()
        const thirdCall = queueableFunction.queueRun()

        expect(secondCall).toEqual(thirdCall)
        expect(counter).toBe(0)

        await firstCall
        expect(counter).toBe(1)

        await secondCall
        expect(counter).toBe(2)
    })
})
