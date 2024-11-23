import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import AppConfig from '../config/app.config';
import { ErrorResponseHandler, ForbiddenError, UnauthorizedError } from '../utils/errors.utils';

class Guard {

	constructor() { };

/**@description Validates and authorized user session */
	VERIFY_AUTH_TOKEN(req: Request, res: Response, next: NextFunction,) {
		const bearerHeader = req.headers['authorization'];

		try {
			
			if (typeof bearerHeader !== 'undefined') {
				const token = bearerHeader.split(' ')[1];

				jwt.verify(token, AppConfig.JWT_TOKEN, (err: any, payload: any) => {
					if (!err) {
						res.locals = payload;
						next();
					}
					else {
						switch (err.name) {
							// Expired token
							case 'TokenExpiredError':
								throw new ForbiddenError('SESSION EXPIRED: login and try again.');

							// Invalid token
							case 'JsonWebTokenError':
								throw new ForbiddenError('SESSION EXPIRED: login and try again.');

							//Inactive token
							case 'NotBeforeError':
								throw new ForbiddenError('SESSION EXPIRED: login and try again.');

							default:
								throw new ForbiddenError('UNAUTHORIZED!: login and try again');
						}
					}
				})
			} else
				throw new UnauthorizedError('UNAUTHORIZED!: Authentication token required');
		}
		catch (e: Error | unknown) {
			new ErrorResponseHandler(e, res);
		}
	}

	/**
	 * Issue authorization token
	 * @param {String|Buffer|object} payload - Payload data
	 * @param {string} key - JWT Secret key
	 * @return - Base64 string
	 */
	SIGN_AUTH_TOKEN(payload: object | string | Buffer, key: string) {
		return jwt.sign({ payload }, key, {
			expiresIn: '1d'
		});
	}
}

export default Guard;