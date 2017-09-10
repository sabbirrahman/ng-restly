// Imports from @angular
import { BaseRequestOptions, RequestOptions, ResponseOptions } from '@angular/http';
import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { Http, Response } from '@angular/http';
// The Test Service
import { ResourceService, BaseResourceConfig } from './resource.service';

const backendResponse = (c, b) => {
  return c.mockRespond(new Response(<ResponseOptions>{ body: JSON.stringify(b) }));
}

let backend: MockBackend;
let service: ResourceService;

const arrResponse = [{ id: 123, text: 'abc' }, { id: 321, text: 'def' }];
const singleResponse = { id: 123, text: 'abc' };

describe('ResourceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BaseRequestOptions,
        ResourceService,
        MockBackend, {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
    backend = TestBed.get(MockBackend);
    service = TestBed.get(ResourceService);
  });

  it('should have the REST methods (query, get, save, update & delete)',
    inject([ResourceService], (resource) => {
      expect(resource.query).toBeDefined();
      expect(resource.get).toBeDefined();
      expect(resource.save).toBeDefined();
      expect(resource.update).toBeDefined();
      expect(resource.delete).toBeDefined();
    })
  );

  it('should set and get private property baseUrl',
    inject([ResourceService], (service: ResourceService) => {
      service.url = 'http://api.example.com/post/:id';
      expect(service.url).toBe('http://api.example.com/post/:id');
    })
  );

  it('should add x-access-token header if authentication is true and jwt token exist in localStorage',
    inject([ResourceService], (service: ResourceService) => {
      service.authenticate();
      expect(service.resourceConfig.requestOptions.headers.has('x-access-token')).toBeFalsy();
      BaseResourceConfig.auth = true;
      localStorage.setItem('accessToken', 'fake.jwt.token');
      service.authenticate();
      expect(service.resourceConfig.requestOptions.headers.has('x-access-token')).toBeTruthy();
      localStorage.removeItem('accessToken');
    })
  );

  it('should take a base url and create REST method specific url',
    inject([ResourceService], (service: ResourceService) => {
      service.url = 'v3/api/posts';
      expect(service.makeUrl({})).toBe('v3/api/posts');
      service.url = 'v3/api/posts/:id';
      expect(service.makeUrl({})).toBe('v3/api/posts');
      expect(service.makeUrl({ id: 123 })).toBe('v3/api/posts/123');
      service.url = 'v3/api/posts/:id/comments/:commentId';
      expect(service.makeUrl({ id: 123 })).toBe('v3/api/posts/123/comments');
      expect(service.makeUrl({ id: 123, commentId: 321 })).toBe('v3/api/posts/123/comments/321');
    })
  );

  it('should make a query string from given object',
    inject([ResourceService], (service: ResourceService) => {
      const obj = {
        limit: 10,
        pageNumber: 1,
        keywords: ['android', 'iOS', 'Windows'],
        ignore: '',
        list: []
      }
      const queryString = service.makeQueryString(obj);
      expect(queryString).toBe('?limit=10&pageNumber=1&keywords=android,iOS,Windows');
    })
  );

  describe('should use the REST methods including', () => {
    describe('query method which should return an array', () => {
      it('for basic query request', () => {
        backend.connections.subscribe(c => {
          expect(c.request.url).toBe('v3/posts');
          backendResponse(c, arrResponse);
        });
        service.url = 'v3/posts/:id';
        service.query().subscribe();
      });

      it('for request with query parameters and url suffix', () => {
        backend.connections.subscribe(c => {
          expect(c.request.url).toBe('v3/posts/123/comments/mock?pageNo=1');
          backendResponse(c, arrResponse);
        });
        service.url = 'v3/posts/:id/comments/:commentId';
        service.query({ id: 123 }, { urlSuffix: '/mock', params: { pageNo: 1} }).subscribe((res) => {
          expect(res.length).toBe(2);
          expect(res[0].id).toBe(123);
          expect(res[1].text).toBe('def');
        });
      });
    });

  });

});
