import { BaseHandler } from './baseHandler';
import { BaseHandlerRegistrator } from './baseHandlerRegistrator';

export class HandlerRegistratorCollector {
  private readonly registrators: BaseHandlerRegistrator[] =
    new Array<BaseHandlerRegistrator>();

  constructor(registrators: BaseHandlerRegistrator[]) {
    registrators.forEach((registrator) => this.registrators.push(registrator));
  }

  private getKey(handler: BaseHandler) {
    return `${handler.getEndpointMethod()}:${handler.getEndpoint()}`;
  }

  public getHandlers(): Map<string, BaseHandler> {
    const handlers: Map<string, BaseHandler> = new Map();

    this.registrators.forEach((registrator) => {
      registrator.getEndpoints().forEach((handler) => {
        const key = this.getKey(handler);
        handlers.set(key, handler);
      });
    });

    return handlers;
  }
}
