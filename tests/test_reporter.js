const { createGroup, assert, stub } = require('painless')
const reporter = require('../lib/reporter')
const test = createGroup()
let logSpy = null
let exitSpy = null

test.beforeEach(() => {
    logSpy = stub(console, 'error', () => {})
    exitSpy = stub(process, 'exit', () => {})
})
test.afterEach(() => {
    console.error.restore()
    process.exit.restore()
})


test('reporter', () => {
    reporter({
        errors: { FOO: new Error('hi') },
        env: {}
    })
    assert.strictEqual(logSpy.callCount, 1)

    const output = logSpy.firstCall.args[0]
    assert.match(output, /Invalid environment variable/)
    assert.match(output, /FOO: hi/)
    assert.notMatch(output, /Missing environment variables:/)

    assert.strictEqual(exitSpy.callCount, 1)
    assert(exitSpy.firstCall.calledWithExactly(1))
})
