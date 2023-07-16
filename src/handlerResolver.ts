import { BaseHandler } from './baseHandler';
import { DuffleRequest, DuffleResponse } from './commonTypes';
import { DuffleStatus } from './duffleStatusCodes';
import { HandlerRegistratorCollector } from './handlerRegistratorCollector';

export class HandlerResolver {
  private handlers: Map<string, BaseHandler>;

  constructor(collector: HandlerRegistratorCollector) {
    this.handlers = collector.getHandlers();
  }

  /**
   * resolves a specified https-like request
   * if promise is rejected, the promise reject value will be upstreamed
   *
   * USE TRY CATCH to handle promise rejection
   *
   * @param request
   * @returns Promise<DuffleResponse> - if successful returns a DuffleResponse
   */
  public async resolve(request: DuffleRequest): Promise<DuffleResponse> {
    const key = `${request.method}:${request.url}`;
    const handler = this.handlers.get(key);

    if (!handler) {
      const err: DuffleResponse = {
        body: `No handler found for endpoint: "${request.url}" and method: "${request.method}"`,
        status: 'ERROR',
      };

      return Promise.reject(err);
    }

    return await handler.handle(request);
  }
}
