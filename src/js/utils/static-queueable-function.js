export default class StaticQueueableFunction {
    constructor(func, delayInMs = 0) {
        if (typeof func !== 'function') {
            throw new TypeError(
                'Expected a function for the constructor argument'
            )
        }
        this.func = func
        this.delayInMs = delayInMs
        this.queued = false
        this.running = false
    }

    queueRun() {
        this.queued = true
        if (!this.running) {
            this.currnetPromise = new Promise((resolve) => {
                this.resolve = resolve
            })
            this.runFunc()
            return this.currnetPromise
        } else {
            this.queuedPromise =
                this.queuedPromise ||
                new Promise((resolve) => {
                    this.queuedResolve = resolve
                })
            return this.queuedPromise
        }
    }

    async runFunc() {
        this.running = true
        this.queued = false
        if (this.delayInMs > 0) {
            await new Promise((resolve) => setTimeout(resolve, this.delayInMs))
        }
        try {
            await this.func()
        } catch (error) {
            console.error('Error during function execution:', error)
        }
        this.running = false
        this.resolve()
        if (this.queued) {
            this.currnetPromise = this.queuedPromise
            this.resolve = this.queuedResolve
            this.queuedPromise = null
            this.queuedResolve = null
            this.runFunc()
        }
    }
}
