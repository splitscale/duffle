import { BaseHandler } from './baseHandler';

/*
 * This class should be extended by the registrators.
 */
export abstract class BaseHandlerRegistrator {
  protected handlers: BaseHandler[] = new Array<BaseHandler>();

  public getEndpoints(): BaseHandler[] {
    return this.handlers;
  }
}
