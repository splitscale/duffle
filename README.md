# 👜 duffle
A service locator SDK built with typescript

# Introduction
The Duffle Package contains interfaces, classes, and abstract classes that can be used to register API endpoints and service handlers to the Arrow Service Package.

# Resources
## The `BaseHandler` abstract class
This is the primary contract for creating `DuffleRequest` Handler that can be mapped into the controller when registered.

### Usage

When the Handler is created, two things must be configured on the constructor:
  - method - Specifies what DuffleRequestMethods this handler supports
  - endpoint- Specifies what API endpoint this will be accessible.

### Restrictions
  - When a certain `endpoint` already existed or is registered, this will be ignored.
  - Methods such as `getMethodType()` and `getEndpoint()` are non-overridable. These methods are there to retrieve `method` and `endpoint` properties.

### Methods
```typescript
/*
* The method that is responsible to handle DuffleRequest when its handler is called.
*/
handle(request: DuffleRequest): Promise<DuffleResponse>;

/*
* Returns a DuffleRequestMethods enum string
*/
getEndpointMethod(): DuffleRequestMethods

/*
* Returns the absolute path where this handler can be accessed.
*/
getEndpoint(): string
```

### Usage Guide
```typescript
import { BaseHandler, DuffleRequest, DuffleResponse } from 'duffle';
import BaseRepository from '../../../repository/baseRepository';
import { UserInfoRepositoryInteractor } from '../userInfoRepositoryInteractor';

export class AddUserInfoHandler extends BaseHandler {
  private readonly interactor: UserInfoRepositoryInteractor;

  constructor(db: BaseRepository) {
    super();

    this.method = 'POST';
    this.endpoint = '/api/userinfo';
    this.interactor = new UserInfoRepositoryInteractor(db); // todo: add to contructor parameter
  }

  public async handle(request: DuffleRequest): Promise<DuffleResponse> {
    const firstName = request.body?.get('firstName');
    const lastName = request.body?.get('lastName');

    try {
      const id = await this.interactor.add({
        firstName: firstName,
        lastName: lastName,
      });

      const res: DuffleResponse = {
        status: 'OK',
        body: id,
      };

      return res;
    } catch (error) {
      const res: DuffleResponse = {
        status: 'ERROR',
        body: error as string,
      };

      return Promise.reject(res);
    }
  }
}
```

## The `BaseHandlerRegistrator` abstract class
This is the class responsible for registering endpoints of the service.

### Methods
```typescript
/*
* Gets all registered endpoints here.
*/
public getEndpoints(): BaseHandler[]
```

### Usage Guide
```typescript
import { BaseHandlerRegistrator } from 'duffle/bin/baseHandlerRegistrator';
import BaseRepository from '../../repository/baseRepository';
import { AddUserInfoHandler } from './handlers/addUserInfoHandler';

export class UserInfoRegistrator extends BaseHandlerRegistrator {
  constructor(db: BaseRepository) {
    super();
    this.handlers.push(new AddUserInfoHandler(db));
  }
}
```

## The `HandlerRegistratorCollector` class
This is the class responsible for collecting registered handlers.

### Methods
```typescript
/*
* gets all collected handlers.
*/
public getHandlers(): Map<string, BaseHandler>
```

### Usage Guide
```typescript
const db: FirebaseRepository = new FirebaseRepository(
    FirebaseAccessor.getDb()
  );

  const collector = new HandlerRegistratorCollector([
    new UserInfoRegistrator(db),
  ]);
```


## The `HandlerResolver` class
This class is responsible for locating registered handlers.

### Methods
```typescript
/*
* locates registered handlers specified in the request url.
*/
public async resolve(request: DuffleRequest): Promise<DuffleResponse>
```

### Usage Guide
```typescript
 const resolver = new HandlerResolver(collector);

const body = new Map<string, any>();
body.set('firstName', 'John');
body.set('lastName', 'doe');

const request: DuffleRequest = {
  method: 'POST',
  url: '/api/userinfo',
  body: body,
};

try {
  const res = await resolver.resolve(request);
  console.log(res);
} catch (error) {
  console.error(error);
  console.info('ERROR IS HANDLED CORRECTLY');
}
```

# General Usage Context
```typescript
import { HandlerRegistratorCollector, HandlerResolver } from 'duffle';
import { UserInfoRegistrator } from './core-services/userInfoManagementService/userInfoRegistrator';
import FirebaseAccessor from './dataAccess/firebase/firebaseAccessor';
import { FirebaseRepository } from './dataAccess/firebase/firebaseRepository';

const Service = (): HandlerResolver => {
  const db: FirebaseRepository = new FirebaseRepository(
    FirebaseAccessor.getDb()
  );

const collector = new HandlerRegistratorCollector([
  new UserInfoRegistrator(db),
    // Add more registrators here...
  ]);

  const resolver = new HandlerResolver(collector);

  return resolver;
};

export const service = Service(); // use service in UI
```

# Data types
## `type DuffleRequestMethods`
```typescript
export type DuffleRequestMethods =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'PATCH'
  | 'HEAD'
  | 'OPTIONS'
  | 'TRACE'
  | 'CONNECT';
```

## `interface DuffleRequest`
```typescript
export interface DuffleRequest {
  method: DuffleRequestMethods;
  url: string;
  body?: Map<string, any> | Object | string;
}
```

## `interface DuffleResponse`
```typescript
export interface DuffleResponse {
  status: DuffleStatus;
  body: Map<string, any> | Object | string | null;
}
```

## `DuffleStatusCode.ts`
```typescript
export type DuffleStatus = 'OK' | 'ERROR';
```
