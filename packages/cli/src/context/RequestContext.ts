import { AsyncLocalStorage } from 'async_hooks';

interface RequestContextData {
	requestId: string;
}

export class RequestContext {
	private static storage = new AsyncLocalStorage<RequestContextData>();

	static run(requestId: string, callback: () => void) {
		this.storage.run({ requestId }, callback);
	}

	static getRequestId(): string {
		return this.storage.getStore()?.requestId || '';
	}
}
