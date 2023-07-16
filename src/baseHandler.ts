import { DuffleRequest, DuffleResponse } from './commonTypes';
import { DuffleRequestMethods } from './duffleRequestMethods';

export abstract class BaseHandler {
  protected endpoint: string;

  protected method: DuffleRequestMethods;

  constructor() {
    this.method = 'GET';
    this.endpoint = 'endpoint unimplemented';
  }

  public abstract handle(request: DuffleRequest): Promise<DuffleResponse>;

  public getEndpoint(): string {
    return this.endpoint;
  }

  public getEndpointMethod(): DuffleRequestMethods {
    return this.method;
  }
}
