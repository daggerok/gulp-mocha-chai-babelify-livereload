import chai from 'chai'
import chai_things from 'chai-things'
import {minus} from '../../src/modules/calc2'
chai.use(chai_things)

let assert = chai.assert

describe('minus', () => {
  it('1 minus 2 == -1', done => {
    assert.equal(minus(1, 2), -1, "wrong minus");
    done()
  })
})
