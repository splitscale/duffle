import { DuffleRequestMethods } from './duffleRequestMethods';
import { DuffleStatus } from './duffleStatusCodes';

// Define an interface for an HTTP request
export interface DuffleRequest {
  method: DuffleRequestMethods;
  url: string;
  body?: Map<string, any>;
}

// Define an interface for an HTTP response
export interface DuffleResponse {
  status: DuffleStatus;
  body: Map<string, any> | Object | string | null;
}
