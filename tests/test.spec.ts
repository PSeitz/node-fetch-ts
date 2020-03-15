import fetch, { FetchError, Headers, Request, Response } from "../src/index";
import * as stream from "stream";
import "./extend_jest";
import TestServer from "./server";

const local = new TestServer();
const base = `http://${local.hostname}:${local.port}/`;

beforeAll(async () => local.start());
afterAll(async () => local.stop());

const testIf = (val: any) => (val ? test : test.skip);

// declare global {
// 	// eslint-disable-next-line @typescript-eslint/no-namespace
// 	namespace jest {
// 		interface Matchers<R> {
// 			toBeType(value: string): CustomMatcherResult;
// 			// toHaveErrorMessage(value: string): CustomMatcherResult;
// 		}
// 	}
// }

// expect.extend({
// 	toBeType(received, argument) {
// 		const initialType = typeof received;
// 		const type =
// 			initialType === "object"
// 				? Array.isArray(received)
// 					? "array"
// 					: initialType
// 				: initialType;
// 		if (type === argument) {
// 			return {
// 				message: () => `expected ${received} to be type ${argument}`,
// 				pass: true
// 			};
// 		} else {
// 			return {
// 				message: () => `expected ${received} to be type ${argument}`,
// 				pass: false
// 			};
// 		}
// 	}
// });

// expect.extend({
// 	toHaveErrorMessage(received, argument) {
// 		try {
// 			received;
// 			// throw new Error("expected to throw an error but didn't")
// 		} catch (e) {
// 			if (e.message === argument) {
// 				return {
// 					message: () => `expected error message ${received} to be ${argument}`,
// 					pass: true
// 				};
// 			} else {
// 				return {
// 					message: () => `expected error message ${received} to be ${argument}`,
// 					pass: false
// 				};
// 			}
// 		}
// 		return {
// 			message: () =>
// 				`expected error message ${received}, but not error was thrown`,
// 			pass: false
// 		};
// 	}
// });

describe("test things", () => {
	test("should return a promise", () => {
		const url = `${base}hello`;
		const p = fetch(url);
		expect(p).toBeInstanceOf(Promise);
		expect(p).toHaveProperty("then");
	});

	test("should accept json response", async () => {
		const url = `${base}json`;
		const res = await fetch(url);
		expect(res.headers.get("content-type")).toEqual("application/json");
		const result = await res.json();
		expect(res.bodyUsed).toBeTruthy();
		expect(result).toBeType("object");
		expect(result).toEqual({ name: "value" });

		// expect.assertions(1);
		expect(Promise.reject("no")).rejects.toEqual("no");
	});

	test("should support proper toString output for Headers, Response and Request objects", () => {
		expect(new Headers().toString()).toEqual("[object Headers]");
		expect(new Response().toString()).toEqual("[object Response]");
		expect(new Request(base).toString()).toEqual("[object Request]");
	});

	test("should reject with error if url is protocol relative", () => {
		const url = "//example.com/";
		expect(fetch(url)).rejects.toEqual(
			new TypeError("Only absolute URLs are supported")
		);
	});

	test("should reject with error if url is relative path", () => {
		const url = "/some/path";
		expect(fetch(url)).rejects.toEqual(
			new TypeError("Only absolute URLs are supported")
		);
	});

	test("should reject with error if protocol is unsupported", () => {
		const url = "ftp://example.com/";
		expect(fetch(url)).rejects.toEqual(
			new TypeError("Only HTTP(S) protocols are supported")
		);
	});

	testIf(process.platform !== "win32")(
		"should reject with error on network failure",
		async () => {
			const url = "http://localhost:50000/";
			expect(fetch(url)).rejects.toMatchObject({
				type: "system",
				code: "ECONNREFUSED",
				errno: "ECONNREFUSED"
			});
			// expect_exist(e.erroredSysCall);
		}
	);

	test("error should contain system error if one occurred", () => {
		const err = new FetchError("a message", "system", new Error("an error"));
		return expect(err).toHaveProperty("erroredSysCall");
	});

	test("error should not contain system error if none occurred", () => {
		const err = new FetchError("a message", "a type");
		return expect(err).not.toHaveProperty("erroredSysCall");
	});

	test("should resolve into response", () => {
		const url = `${base}hello`;
		return fetch(url).then(res => {
			expect(res).toBeInstanceOf(Response);
			expect(res.headers).toBeInstanceOf(Headers);
			// expect(res.body).toBeInstanceOf(stream.Transform);
			expect(res.bodyUsed).toBeFalsy();

			expect(res.url).toEqual(url);
			expect(res.ok).toBeTruthy();
			expect(res.status).toEqual(200);
			expect(res.statusText).toEqual("OK");
		});
	});

	test("should accept plain text response", () => {
		const url = `${base}plain`;
		return fetch(url).then(res => {
			expect(res.headers.get("content-type")).toEqual("text/plain");
			return res.text().then(result => {
				expect(res.bodyUsed).toBeTruthy();
				expect(result).toBeType("string");
				expect(result).toEqual("text");
			});
		});
	});

	test("should accept html response (like plain text)", () => {
		const url = `${base}html`;
		return fetch(url).then(res => {
			expect(res.headers.get("content-type")).toEqual("text/html");
			return res.text().then(result => {
				expect(res.bodyUsed).toBeTruthy();
				expect(result).toBeType("string");
				expect(result).toEqual("<html></html>");
			});
		});
	});

	test("should accept json response", () => {
		const url = `${base}json`;
		return fetch(url).then(res => {
			expect(res.headers.get("content-type")).toEqual("application/json");
			return res.json().then(result => {
				expect(res.bodyUsed).toBeTruthy();
				expect(result).toBeType("object");
				expect(result).toEqual({ name: "value" });
			});
		});
	});

	test("should send request with custom headers", () => {
		const url = `${base}inspect`;
		const opts = {
			headers: { "x-custom-header": "abc" }
		};
		return fetch(url, opts)
			.then(res => {
				return res.json();
			})
			.then(res => {
				expect(res.headers["x-custom-header"]).toEqual("abc");
			});
	});

	test("should accept headers instance", async () => {
		const url = `${base}inspect`;
		const opts = {
			headers: new Headers({ "x-custom-header": "abc" })
		};
		const res = await (await fetch(url, opts)).json();
		// await res.json();
		expect(res.headers["x-custom-header"]).toEqual("abc");
	});

	test("should accept custom host header", () => {
		const url = `${base}inspect`;
		const opts = {
			headers: {
				host: "example.com"
			}
		};
		return fetch(url, opts)
			.then(res => {
				return res.json();
			})
			.then(res => {
				expect(res.headers.host).toEqual("example.com");
			});
	});

	test("should accept custom HoSt header", () => {
		const url = `${base}inspect`;
		const opts = {
			headers: {
				HoSt: "example.com"
			}
		};
		return fetch(url, opts)
			.then(res => {
				return res.json();
			})
			.then(res => {
				expect(res.headers.host).toEqual("example.com");
			});
	});

	// test("should follow redirect code 301", () => {
	// 	const url = `${base}redirect/301`;
	// 	return fetch(url).then(res => {
	// 		expect(res.url).toEqual(`${base}inspect`);
	// 		expect(res.status).toEqual(200);
	// 		expect(res.ok).toBeTruthy;
	// 	});
	// });

	// test("should follow redirect code 302", () => {
	// 	const url = `${base}redirect/302`;
	// 	return fetch(url).then(res => {
	// 		expect(res.url).toEqual(`${base}inspect`);
	// 		expect(res.status).toEqual(200);
	// 	});
	// });

	// test("should follow redirect code 303", () => {
	// 	const url = `${base}redirect/303`;
	// 	return fetch(url).then(res => {
	// 		expect(res.url).toEqual(`${base}inspect`);
	// 		expect(res.status).toEqual(200);
	// 	});
	// });

	// test("should follow redirect code 307", () => {
	// 	const url = `${base}redirect/307`;
	// 	return fetch(url).then(res => {
	// 		expect(res.url).toEqual(`${base}inspect`);
	// 		expect(res.status).toEqual(200);
	// 	});
	// });

	// test("should follow redirect code 308", () => {
	// 	const url = `${base}redirect/308`;
	// 	return fetch(url).then(res => {
	// 		expect(res.url).toEqual(`${base}inspect`);
	// 		expect(res.status).toEqual(200);
	// 	});
	// });

	// test("should follow redirect chain", () => {
	// 	const url = `${base}redirect/chain`;
	// 	return fetch(url).then(res => {
	// 		expect(res.url).toEqual(`${base}inspect`);
	// 		expect(res.status).toEqual(200);
	// 	});
	// });
});
