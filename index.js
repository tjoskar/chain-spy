function create(overwrite = {}) {
  const __execution_log__ = []
  const logGet = name => {
    __execution_log__.push({
      type: 'get',
      name
    })
  }
  const logApply = args => {
    __execution_log__.push({
      type: 'apply',
      args
    })
  }
  const proxy = new Proxy(Function, {
    apply: (target, thisValue, args) => {
      logApply(args)
      return proxy
    },
    get: (target, name) => {
      if (name === '__execution_log__') {
        return __execution_log__
      }
      logGet(name)
      if (!(name in overwrite)) {
        return proxy
      } else if (typeof overwrite[name] === 'function') {
        return (...args) => {
          logApply(args)
          return Reflect.apply(overwrite[name], proxy, args)
        }
      } else {
        return overwrite[name]
      }
    }
  })

  return proxy
}

module.exports = {
  create
}
