expect.extend({
	toBeType(received, argument) {
		const initialType = typeof received;
		const type =
			initialType === "object"
				? Array.isArray(received)
					? "array"
					: initialType
				: initialType;
		if (type === argument) {
			return {
				message: () => `expected ${received} to be type ${argument}`,
				pass: true
			};
		} else {
			return {
				message: () => `expected ${received} to be type ${argument}`,
				pass: false
			};
		}
	}
});

function isIterable(value: any) {
	return Symbol.iterator in Object(value);
}

expect.extend({
	toBeIterable(received) {
		if (isIterable(received)) {
			return {
				message: () => `expected ${received} to be iterable`,
				pass: true
			};
		} else {
			return {
				message: () => `expected ${received} to be iterable`,
				pass: false
			};
		}
	}
});

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace jest {
		interface Matchers<R> {
			toBeType(value: string): CustomMatcherResult;
			toBeIterable(): CustomMatcherResult;
			// toHaveErrorMessage(value: string): CustomMatcherResult;
		}
	}
}

export {};
