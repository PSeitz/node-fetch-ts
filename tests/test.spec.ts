import fetch, { FetchError, Headers, Request, Response } from "../src/index";
import * as stream from "stream";
import TestServer from "./server";
import { expect } from "chai";

const local = new TestServer();
const base = `http://${local.hostname}:${local.port}/`;

before(done => {
	local.start(done);
});

after(done => {
	local.stop(done);
});
const itIf = (val: any) => (val ? it : it.skip);

describe("service/meta/deploy/esh/joinview", () => {
	it("should return a promise", () => {
		const url = `${base}hello`;
		const p = fetch(url);
		expect(p).to.be.an.instanceof(Promise);
		expect(p).to.have.property("then");
	});

	it("should accept json response", async () => {
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

		await expect_error(Promise.reject("no"));
	});

	it("should support proper toString output for Headers, Response and Request objects", () => {
		expect(new Headers().toString()).to.equal("[object Headers]");
		expect(new Response().toString()).to.equal("[object Response]");
		expect(new Request(base).toString()).to.equal("[object Request]");
	});

	it("should reject with error if url is protocol relative", () => {
		const url = "//example.com/";
		expect_error(fetch(url), "Only absolute URLs are supported");
	});

	it("should reject with error if url is relative path", () => {
		const url = "/some/path";
		return expect_error(fetch(url), "Only absolute URLs are supported");
	});

	it("should reject with error if protocol is unsupported", () => {
		const url = "ftp://example.com/";
		return expect_error(fetch(url), "Only HTTP(S) protocols are supported");
	});

	itIf(process.platform !== "win32")(
		"should reject with error on network failure",
		async () => {
			const url = "http://localhost:50000/";
			const e: FetchError = await expect_error(fetch(url));
			assert_equal(e.type, "system");
			assert_equal(e.code, "ECONNREFUSED");
			assert_equal(e.errno, "ECONNREFUSED");
			expect_exist(e.erroredSysCall);
		}
	);

	it("error should contain system error if one occurred", () => {
		const err = new FetchError("a message", "system", new Error("an error"));
		return expect(err).to.have.property("erroredSysCall");
	});

	it("error should not contain system error if none occurred", () => {
		const err = new FetchError("a message", "a type");
		return expect(err).to.not.have.property("erroredSysCall");
	});

	it("should resolve into response", () => {
		const url = `${base}hello`;
		return fetch(url).then(res => {
			expect(res).to.be.an.instanceof(Response);
			expect(res.headers).to.be.an.instanceof(Headers);
			// expect(res.body).to.be.an.instanceof(stream.Transform);
			expect(res.bodyUsed).to.be.false;

			expect(res.url).to.equal(url);
			expect(res.ok).to.be.true;
			expect(res.status).to.equal(200);
			expect(res.statusText).to.equal("OK");
		});
	});
});

async function expect_error(val1: Promise<any>, message?: string) {
	try {
		await val1;
		throw new Error("expected to throw an error but didn't");
	} catch (e) {
		if (message) {
			assert_equal(e.message, message);
		}
		return e;
	}
	// const jo =
	// if(!val1){
	//     throw new Error(`${val1} ist not true`)
	// }
}

// async function expect_throws(val1: Promise<any>) {

//     try{
//         await val1
//         throw new Error("expected to throw an error but didn't")
//     }catch(e){ }
//     // const jo =
//     // if(!val1){
//     //     throw new Error(`${val1} ist not true`)
//     // }
// }

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

function expect_exist<T>(val1: T) {
	if (!val1) {
		throw new Error(`${val1} does not exist`);
	}
}
