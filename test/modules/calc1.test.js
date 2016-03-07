import chai from 'chai'
import chai_things from 'chai-things'
import {plus} from '../../src/modules/calc1'
chai.use(chai_things)

let assert = chai.assert

describe('plus', () => {
  it('3 plus 2 == 5', (done) => {
    let actual = plus(3, 2)
    let expected = 5

    assert.equal(actual, expected, "wrong plus");
    done()
  })
})
