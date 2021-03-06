import fetch, { FetchError, Headers, Request, Response } from "../src/index";
import * as stream from "stream";
import TestServer from "./server";
import "./extend_jest";

describe("Headers", () => {
	test("should have attributes conforming to Web IDL", () => {
		const headers = new Headers();
		expect(Object.getOwnPropertyNames(headers).length).toEqual(0);
		const enumerableProperties = [];

		for (const property in headers) {
			enumerableProperties.push(property);
		}

		for (const toCheck of [
			"append",
			"delete",
			"entries",
			"forEach",
			"get",
			"has",
			"keys",
			"set",
			"values"
		]) {
			expect(enumerableProperties).toContain(toCheck);
		}
	});

	test("should allow iterating through all headers with forEach", () => {
		const headers = new Headers([
			["b", "2"],
			["c", "4"],
			["b", "3"],
			["a", "1"]
		]);
		expect(headers).toHaveProperty("forEach");

		const result: [string, string][] = [];
		headers.forEach((value, key) => {
			result.push([key, value]);
		});

		expect(result).toEqual([
			["a", "1"],
			["b", "2, 3"],
			["c", "4"]
		]);
	});

	test("should allow iterating through all headers with for-of loop", () => {
		const headers = new Headers([
			["b", "2"],
			["c", "4"],
			["a", "1"]
		]);
		headers.append("b", "3");
		expect(headers).toBeIterable();

		const result = [];
		for (const pair of headers) {
			result.push(pair);
		}

		// expect(result).toEqual([
		// 	["a", "1"],
		// 	["b", "2, 3"],
		// 	["c", "4"]
		// ]);
	});

	test("should allow iterating through all headers with entries()", () => {
		const headers = new Headers([
			["b", "2"],
			["c", "4"],
			["a", "1"]
		]);
		headers.append("b", "3");

		let iter = headers.entries();
		expect(iter).toBeIterable();
		
		expect(Array.from(headers.entries())).toEqual([
			["a", "1"],
			["b", "2, 3"],
			["c", "4"]
		]);
	});

	test("should allow iterating through all headers with keys()", () => {
		const headers = new Headers([
			["b", "2"],
			["c", "4"],
			["a", "1"]
		]);
		headers.append("b", "3");

		expect(headers.keys()).toBeIterable();
		expect(Array.from(headers.keys())).toEqual(["a", "b", "c"]);
	});

	test("should allow iterating through all headers with values()", () => {
		const headers = new Headers([
			["b", "2"],
			["c", "4"],
			["a", "1"]
		]);
		headers.append("b", "3");

		expect(headers.values()).toBeIterable();
		expect(Array.from(headers.values())).toEqual([
			"1",
			"2, 3",
			"4"
		]);
	});

	// test("should reject illegal header", () => {
	// 	const headers = new Headers();
	// 	expect(() => new Headers({ "He y": "ok" })).toThrow(TypeError);
	// 	expect(() => new Headers({ "Hé-y": "ok" })).toThrow(TypeError);
	// 	expect(() => new Headers({ "He-y": "ăk" })).toThrow(TypeError);
	// 	expect(() => headers.append("Hé-y", "ok")).toThrow(TypeError);
	// 	expect(() => headers.delete("Hé-y")).toThrow(TypeError);
	// 	expect(() => headers.get("Hé-y")).toThrow(TypeError);
	// 	expect(() => headers.has("Hé-y")).toThrow(TypeError);
	// 	expect(() => headers.set("Hé-y", "ok")).toThrow(TypeError);
	// 	// Should reject empty header
	// 	expect(() => headers.append("", "ok")).toThrow(TypeError);
	// });

	// test("should ignore unsupported attributes while reading headers", () => {
	// 	const FakeHeader = function() {};
	// 	// Prototypes are currently ignored
	// 	// This might change in the future: #181
	// 	FakeHeader.prototype.z = "fake";

	// 	const res = new FakeHeader();
	// 	res.a = "string";
	// 	res.b = ["1", "2"];
	// 	res.c = "";
	// 	res.d = [];
	// 	res.e = 1;
	// 	res.f = [1, 2];
	// 	res.g = { a: 1 };
	// 	res.h = undefined;
	// 	res.i = null;
	// 	res.j = NaN;
	// 	res.k = true;
	// 	res.l = false;
	// 	res.m = Buffer.from("test");

	// 	const h1 = new Headers(res);
	// 	h1.set("n", [1, 2]);
	// 	h1.append("n", ["3", 4]);

	// 	const h1Raw = h1.raw();

	// 	expect(h1Raw.a).to.include("string");
	// 	expect(h1Raw.b).to.include("1,2");
	// 	expect(h1Raw.c).to.include("");
	// 	expect(h1Raw.d).to.include("");
	// 	expect(h1Raw.e).to.include("1");
	// 	expect(h1Raw.f).to.include("1,2");
	// 	expect(h1Raw.g).to.include("[object Object]");
	// 	expect(h1Raw.h).to.include("undefined");
	// 	expect(h1Raw.i).to.include("null");
	// 	expect(h1Raw.j).to.include("NaN");
	// 	expect(h1Raw.k).to.include("true");
	// 	expect(h1Raw.l).to.include("false");
	// 	expect(h1Raw.m).to.include("test");
	// 	expect(h1Raw.n).to.include("1,2");
	// 	expect(h1Raw.n).to.include("3,4");

	// 	expect(h1Raw.z).to.be.undefined;
	// });

	// test("should wrap headers", () => {
	// 	const h1 = new Headers({
	// 		a: "1"
	// 	});
	// 	const h1Raw = h1.raw();

	// 	const h2 = new Headers(h1);
	// 	h2.set("b", "1");
	// 	const h2Raw = h2.raw();

	// 	const h3 = new Headers(h2);
	// 	h3.append("a", "2");
	// 	const h3Raw = h3.raw();

	// 	expect(h1Raw.a).to.include("1");
	// 	expect(h1Raw.a).to.not.include("2");

	// 	expect(h2Raw.a).to.include("1");
	// 	expect(h2Raw.a).to.not.include("2");
	// 	expect(h2Raw.b).to.include("1");

	// 	expect(h3Raw.a).to.include("1");
	// 	expect(h3Raw.a).to.include("2");
	// 	expect(h3Raw.b).to.include("1");
	// });

	// test("should accept headers as an iterable of tuples", () => {
	// 	let headers;

	// 	headers = new Headers([
	// 		["a", "1"],
	// 		["b", "2"],
	// 		["a", "3"]
	// 	]);
	// 	expect(headers.get("a")).to.equal("1, 3");
	// 	expect(headers.get("b")).to.equal("2");

	// 	headers = new Headers([
	// 		new Set(["a", "1"]),
	// 		["b", "2"],
	// 		new Map([
	// 			["a", null],
	// 			["3", null]
	// 		]).keys()
	// 	]);
	// 	expect(headers.get("a")).to.equal("1, 3");
	// 	expect(headers.get("b")).to.equal("2");

	// 	headers = new Headers(
	// 		new Map([
	// 			["a", "1"],
	// 			["b", "2"]
	// 		])
	// 	);
	// 	expect(headers.get("a")).to.equal("1");
	// 	expect(headers.get("b")).to.equal("2");
	// });

	// test("should throw a TypeError if non-tuple exists in a headers initializer", () => {
	// 	expect(() => new Headers([["b", "2", "huh?"]])).to.throw(TypeError);
	// 	expect(() => new Headers(["b2"])).to.throw(TypeError);
	// 	expect(() => new Headers("b2")).to.throw(TypeError);
	// 	expect(() => new Headers({ [Symbol.iterator]: 42 })).to.throw(TypeError);
	// });
});
