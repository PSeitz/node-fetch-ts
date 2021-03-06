import fetch, { FetchError, Headers, Request, Response } from "../src/index";

import TestServer from "./server";
// import { expect } from "chai";

const local = new TestServer();
const base = `http://${local.hostname}:${local.port}/`;

beforeAll(async () => local.start());
afterAll(async () => local.stop());

// describe("service/meta/deploy/esh/joinview", () => {
test("should return a promise", () => {
	const url = `${base}hello`;
	const p = fetch(url);
	expect(p).toBeInstanceOf(Promise);
	expect(p).toHaveProperty("then");
});

test("should accept json response", async () => {
	const url = `${base}json`;
	const res = await fetch(url);
	// expect(res.headers.get('content-type')).to.equal('application/json');
	assert_equal(res.headers.get("content-type"), "application/json");
	const result = await res.json();
	expect_true(res.bodyUsed);
	expect_type(result, "object");
	// expect(result).to.be.an('object');
	// expect(result).to.deep.equal();
	expect_deep_equal(result, { name: "value" });

	await expect_throws(Promise.reject("no"));
});

test("should support proper toString output for Headers, Response and Request objects", () => {
	expect(new Headers().toString()).toEqual("[object Headers]");
	expect(new Response().toString()).toEqual("[object Response]");
	expect(new Request(base).toString()).toEqual("[object Request]");
});
// });

async function expect_throws(val1: Promise<any>) {
	try {
		await val1;
		throw new Error("expected to throw an error but didn't");
	} catch (e) {}
	// const jo =
	// if(!val1){
	//     throw new Error(`${val1} ist not true`)
	// }
}

function expect_true(val1: boolean) {
	if (!val1) {
		throw new Error(`${val1} ist not true`);
	}
}

function expect_type(val: boolean, type: string) {
	const curr_type = typeof val;
	if (curr_type !== type) {
		throw new Error(`expected ${val} to be ${type} but got ${curr_type}`);
	}
}

function expect_deep_equal<T>(val1: T, val2: T) {
	if (JSON.stringify(val1) !== JSON.stringify(val2)) {
		// TODO fix
		throw new Error(`${val1} does not equal ${val2}`);
	}
}

function assert_equal<T>(val1: T, val2: T) {
	if (val1 !== val2) {
		throw new Error(`${val1} does not equal ${val2}`);
	}
}
