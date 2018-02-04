# chain-spy [![Build Status](https://travis-ci.org/tjoskar/chain-spy.svg?branch=master)](https://travis-ci.org/tjoskar/chain-spy) [![Coverage Status](https://coveralls.io/repos/github/tjoskar/chain-spy/badge.svg?branch=master)](https://coveralls.io/github/tjoskar/chain-spy?branch=master)

> Let's you spy on a chain


## Install

```
$ npm install chain-spy
```


## Usage

```js
import { create } from 'chain-spy'

function select(db) {
  return db
    .select('id', 'name', 'age')
    .where('name', 'Daenerys')
    .sort('age')
    .someFunction(5)
}


const dbProxy = create({ someFunction: n => n })

const result = select(dbProxy)


console.log(result)
// 5
console.log(dbProxy.__execution_log__)
// [ { type: 'get', name: 'select' },
//   { type: 'apply', args: [ 'id', 'name', 'age' ] },
//   { type: 'get', name: 'where' },
//   { type: 'apply', args: [ 'name', 'Daenerys' ] },
//   { type: 'get', name: 'sort' },
//   { type: 'apply', args: [ 'age' ] } ]
//   { type: 'get', name: 'someFunction' },
//   { type: 'apply', args: [ 5 ] } ]

// Can be used with snapshot testing, eg.
expect(dbProxy.__execution_log__).toMatchSnapshot() // jest
t.snapshot(dbProxy.__execution_log__); // ava
```

## API

### create(overwrite?)

#### overwrite (optional)

Type: `object`

Can overwrite the return value of a property. eg.
```js
const proxy = create({ hello: 'world', cat: n => n + 1 })

proxy.hello // world
proxy.something.hello // world
proxy.something('else').hello // world
proxy.cat(1) // 2
```

Can also access the proxy inside a overwrite function:
```js
const proxy = create({ hello: function(n) {
  return n === 5 ? 7 : this
}})

proxy.hello(1).hello(2).hello(5) // 7
```

## License

MIT
