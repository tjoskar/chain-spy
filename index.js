export function create(overwrite = {}) {
	const __EXECUTION_LOG__ = [];
	const logGet = name => {
		__EXECUTION_LOG__.push({
			type: 'get',
			name,
		});
	};

	const logApply = args => {
		__EXECUTION_LOG__.push({
			type: 'apply',
			args,
		});
	};

	const proxy = new Proxy(Function, {
		apply(target, thisValue, args) {
			logApply(args);
			return proxy;
		},
		get(target, name) {
			if (name === '__execution_log__') {
				return __EXECUTION_LOG__;
			}

			logGet(name);
			if (!(name in overwrite)) {
				return proxy;
			}

			if (typeof overwrite[name] === 'function') {
				return (...args) => {
					logApply(args);
					return Reflect.apply(overwrite[name], proxy, args);
				};
			}

			return overwrite[name];
		},
	});

	return proxy;
}
