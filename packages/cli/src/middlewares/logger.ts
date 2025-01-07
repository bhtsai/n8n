import {v4 as uuid} from 'uuid';
import {RequestHandler} from 'express';
import {RequestContext} from '@/context/RequestContext';
import {Container} from 'typedi';
import {Logger} from '@/Logger';

export const requestLoggerMiddleware: RequestHandler = (req, res, next) => {
	const requestId = uuid();
	const requestStartTime = Date.now();

	// store requestId in RequestContext
	RequestContext.run(requestId, () => {
		const logger = Container.get(Logger);
		logger.info(`Incoming request: ${req.method} ${req.originalUrl}`);

		res.on('finish', () => {
			const requestEndTime = Date.now();
			const responseTime = requestEndTime - requestStartTime;

			logger.info(`Response status: ${res.statusCode} | Response time: ${responseTime}ms`);
		});

		next();
	});
};
