import {v4 as uuid} from 'uuid';
import {RequestHandler} from 'express';
import {RequestContext} from '@/context/RequestContext';
import {Container} from 'typedi';
import {Logger} from '@/Logger';
import type {AuthenticatedRequest} from "@/requests";

export const requestLoggerMiddleware: RequestHandler = (req: AuthenticatedRequest, res, next) => {
	const requestId = uuid();
	const requestStartTime = Date.now();
	if (req.originalUrl !== '/rest/cta/become-creator')
		return next();

	// store requestId in RequestContext
	RequestContext.run(requestId, () => {
		const logger = Container.get(Logger);
		console.log(req?.user)
		logger.info(`Incoming request: ${req.method} ${req.originalUrl}, requester=${req?.user?.email}`);

		res.on('finish', () => {
			const requestEndTime = Date.now();
			const responseTime = requestEndTime - requestStartTime;

			logger.info(`Response status: ${res.statusCode} | Response time: ${responseTime}ms`);
		});

		next();
	});
};
