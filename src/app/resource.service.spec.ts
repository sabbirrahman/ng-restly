// Imports from @angular
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, getTestBed } from '@angular/core/testing';
// The Test Service
import { ResourceService, BaseResourceConfig } from './resource.service';

let backend: HttpTestingController;
let service: ResourceService;

const arrResponse = [{ id: 123, text: 'abc' }, { id: 321, text: 'def' }];
const singleResponse = { id: 123, text: 'abc' };

describe('ResourceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ResourceService]
    });
    const injector = getTestBed();
    service = injector.get(ResourceService);
    backend = injector.get(HttpTestingController);
  });

  it('should have the REST methods (query, get, save, update & delete)', () => {
    expect(service.query).toBeDefined();
    expect(service.get).toBeDefined();
    expect(service.save).toBeDefined();
    expect(service.update).toBeDefined();
    expect(service.delete).toBeDefined();
  });

  it('should set and get private property baseUrl', () => {
    service.url = 'http://api.example.com/post/:id';
    expect(service.url).toBe('http://api.example.com/post/:id');
  });

  it('should add x-access-token header if authentication is true and jwt token exist in localStorage', () => {
    service.authenticate();
    expect(service.resourceConfig.requestOptions.headers.has('x-access-token')).toBeFalsy();
    BaseResourceConfig.auth = true;
    service.authenticate();
    expect(service.resourceConfig.requestOptions.headers.has('x-access-token')).toBeFalsy();
    localStorage.setItem('accessToken', 'fake.jwt.token');
    service.authenticate();
    expect(service.resourceConfig.requestOptions.headers.has('x-access-token')).toBeTruthy();
    localStorage.removeItem('accessToken');
  });

  describe('should use the REST methods including', () => {
    describe('query method which should return an array', () => {
      it('for basic query request', () => {
        service.url = 'v3/posts';
        service.query().subscribe();

        const req = backend.expectOne('v3/posts');
        expect(req.request.method).toBe('GET');
        req.flush(arrResponse);
      });

      it('for request with query parameters and url suffix', () => {
        service.url = 'v3/posts/:id/comments/:commentId';
        service.query({ id: 123 }, { urlSuffix: '/mock', params: { pageNo: 1, keywords: ['android', 'iphone'] } })
          .subscribe((res) => {
            expect(res.length).toBe(2);
            expect(res[0].id).toBe(123);
            expect(res[1].text).toBe('def');
          });

        const req = backend.expectOne('v3/posts/123/comments/mock?pageNo=1&keywords=android&keywords=iphone');
        expect(req.request.method).toBe('GET');
        req.flush(arrResponse);
      });
    });

    describe('get method which should return a single object', () => {
      it('for basic query request', () => {
        service.url = 'v3/posts/:id';
        service.get({ id: 123 }).subscribe((res) => {
          expect(res.id).toBe(123);
          expect(res.text).toBe('abc');
        });

        const req = backend.expectOne('v3/posts/123');
        expect(req.request.method).toBe('GET');
        req.flush(singleResponse);
      });

      it('for request with query parameters and url suffix', () => {
        service.url = 'v3/posts/:id';
        service.get({ id: 123 }, { urlSuffix: '/mock', params: { pageNo: 1} })
          .subscribe((res) => {
            expect(res.id).toBe(123);
            expect(res.text).toBe('abc');
          });

        const req = backend.expectOne('v3/posts/123/mock?pageNo=1');
        expect(req.request.method).toBe('GET');
        req.flush(singleResponse);
      });
    });

    describe('save method which should send data to be created to server', () => {
      it('for basic save request', () => {
        service.url = 'v3/posts/:id';
        service.save({ text: 'abcdef' }).subscribe();

        const req = backend.expectOne('v3/posts');
        expect(req.request.method).toBe('POST');
        expect(JSON.parse(req.request.body).text).toBe('abcdef');
      });

      it('for request with query parameters and url suffix', () => {
        service.url = 'v3/posts/:id';
        service.save({ text: 'ghijkl' }, { id: 123 }, { urlSuffix: '/mock', params: { pageNo: 1} })
          .subscribe();

        const req = backend.expectOne('v3/posts/123/mock?pageNo=1');
        expect(req.request.method).toBe('POST');
        expect(JSON.parse(req.request.body).text).toBe('ghijkl');
      });
    });

    describe('update method which should send data to be updated to server', () => {
      it('for basic update request', () => {
        service.url = 'v3/posts/:id';
        service.update({ text: 'abcdef' }, { id: 123 }).subscribe();

        const req = backend.expectOne('v3/posts/123');
        expect(req.request.method).toBe('PUT');
        expect(JSON.parse(req.request.body).text).toBe('abcdef');
      });

      it('for request with query parameters and url suffix', () => {
        service.url = 'v3/posts/:id';
        service.update({ text: 'ghijkl' }, { id: 123 }, { urlSuffix: '/mock', params: { pageNo: 1} })
          .subscribe();

        const req = backend.expectOne('v3/posts/123/mock?pageNo=1');
        expect(req.request.method).toBe('PUT');
        expect(JSON.parse(req.request.body).text).toBe('ghijkl');
      });
    });

    describe('delete method which should delete a data', () => {
      it('for basic delete request', () => {
        service.url = 'v3/posts/:id';
        service.delete({ id: 123 }).subscribe();

        const req = backend.expectOne('v3/posts/123');
        expect(req.request.method).toBe('DELETE');
      });

      it('for request with query parameters and url suffix', () => {
        service.url = 'v3/posts/:id';
        service.delete({ id: 123 }, { urlSuffix: '/mock', params: { pageNo: 1} })
          .subscribe();

        const req = backend.expectOne('v3/posts/123/mock?pageNo=1');
        expect(req.request.method).toBe('DELETE');
      });
    });
  });

  describe('search method should provide easy searching', () => {
    it('for basic delete request', () => {
      service.url = 'v3/posts/:id';
      service.search().subscribe();

      const req = backend.expectOne('v3/posts/search');
      expect(req.request.method).toBe('GET');
    });

    it('for request with query parameters and url suffix', () => {
      service.url = 'v3/posts/:id';
      service.search({ params: { pageNo: 1} })
        .subscribe();

      const req = backend.expectOne('v3/posts/search?pageNo=1');
      expect(req.request.method).toBe('GET');
    });
  });

  describe('count method should data count', () => {
    it('for basic delete request', () => {
      service.url = 'v3/posts/:id';
      service.count().subscribe(res => expect(res).toBe(100));

      const req = backend.expectOne('v3/posts/count');
      expect(req.request.method).toBe('GET');
      req.flush(100);
    });

    it('for request with query parameters and url suffix', () => {
      service.url = 'v3/posts/:id';
      service.count({ params: { pageNo: 1} })
        .subscribe(res => expect(res).toBe(1200));

      const req = backend.expectOne('v3/posts/count?pageNo=1');
      expect(req.request.method).toBe('GET');
      req.flush(1200);
    });
  });

});
