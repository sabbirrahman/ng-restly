// Imports from @angular
import { BaseRequestOptions, RequestOptions } from '@angular/http';
import { TestBed, inject } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { Http } from '@angular/http';
// The Test Service
import { ResourceService, BaseResourceConfig } from './resource.service';

describe('ResourceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BaseRequestOptions,
        ResourceService,
        MockBackend,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
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

  it('should set and get private baseUrl property',
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
      localStorage.setItem('accessToken', 'fakejwttoken');
      service.authenticate();
      expect(service.resourceConfig.requestOptions.headers.has('x-access-token')).toBeTruthy();
    })
  );
});
