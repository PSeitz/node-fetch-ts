/**
 * Fetch-error.js
 *
 * FetchError interface for operational errors
 */

/**
 * Create FetchError instance
 *
 * @param   String      message      Error message for human
 * @param   String      type         Error type for machine
 * @param   Object      systemError  For Node.js system error
 * @return  FetchError
 */
export default class FetchError extends Error {
	type: string;
	code?: number;
	errno?: number;
	erroredSysCall?: {code: number};

	[Symbol.toStringTag] = 'FetchError';
	name = 'FetchError';

	constructor(message: string, type: string, systemError?: Error & {code: number}) {
		super(message);

		this.message = message;
		this.type = type;
		this.name = 'FetchError';

		// When err.type is `system`, err.erroredSysCall contains system error and err.code contains system error code
		if (systemError) {
			this.code = this.errno = systemError.code;
			this.erroredSysCall = systemError;
		}

		// Hide custom error implementation details from end-users
		Error.captureStackTrace(this, this.constructor);
	}
}
