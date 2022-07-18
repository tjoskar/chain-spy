import {test, expect} from 'vitest';
import {create} from './index.js';

test('Log get execution', () => {
	// Arrange
	const proxy = create();

	// Act
	proxy.hello;

	// Assert
	expect(proxy.__execution_log__).toEqual([
		{
			type: 'get',
			name: 'hello',
		},
	]);
});

test('Overwrite property execution', () => {
	// Arrange
	const proxy = create({hello: 'world'});

	// Act
	const result = proxy.hello;

	// Assert
	expect(result).toBe('world');
	expect(proxy.__execution_log__).toEqual([
		{
			type: 'get',
			name: 'hello',
		},
	]);
});

test('Overwrite property execution with a function', () => {
	// Arrange
	const proxy = create({hello: a => a - 1});

	// Act
	const result = proxy.hello(5);

	// Assert
	expect(result).toBe(4);
	expect(proxy.__execution_log__).toEqual([
		{
			type: 'get',
			name: 'hello',
		},
		{
			type: 'apply',
			args: [5],
		},
	]);
});

test('Log an apply', () => {
	// Arrange
	const proxy = create();

	// Act
	proxy(5);

	// Assert
	expect(proxy.__execution_log__).toEqual([
		{
			type: 'apply',
			args: [5],
		},
	]);
});

test('Access to the proxy in a overwrite', () => {
	// Arrange
	const proxy = create({
		hello() {
			return this;
		},
		cat: 5,
	});

	// Act
	const result = proxy.hello().cat;

	// Assert
	expect(result).toBe(5);
});

test('Chain execution', () => {
	// Arrange
	const proxy = create();

	// Act
	proxy.hello
		.world(5)
		.some.else(1)
		.select('id', 'name')
		.from('table');

	// Assert
	expect(proxy.__execution_log__).toMatchSnapshot();
});
