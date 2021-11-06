import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IUsersPasswords, UsersPasswords } from '../users-passwords.model';

import { UsersPasswordsService } from './users-passwords.service';

describe('UsersPasswords Service', () => {
  let service: UsersPasswordsService;
  let httpMock: HttpTestingController;
  let elemDefault: IUsersPasswords;
  let expectedResult: IUsersPasswords | IUsersPasswords[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(UsersPasswordsService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 'AAAAAAA',
      secret: 'AAAAAAA',
      type: 'AAAAAAA',
      platform: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a UsersPasswords', () => {
      const returnedFromService = Object.assign(
        {
          id: 'ID',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new UsersPasswords()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a UsersPasswords', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          secret: 'BBBBBB',
          type: 'BBBBBB',
          platform: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a UsersPasswords', () => {
      const patchObject = Object.assign(
        {
          type: 'BBBBBB',
          platform: 'BBBBBB',
        },
        new UsersPasswords()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of UsersPasswords', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          secret: 'BBBBBB',
          type: 'BBBBBB',
          platform: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a UsersPasswords', () => {
      service.delete('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addUsersPasswordsToCollectionIfMissing', () => {
      it('should add a UsersPasswords to an empty array', () => {
        const usersPasswords: IUsersPasswords = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        expectedResult = service.addUsersPasswordsToCollectionIfMissing([], usersPasswords);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(usersPasswords);
      });

      it('should not add a UsersPasswords to an array that contains it', () => {
        const usersPasswords: IUsersPasswords = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const usersPasswordsCollection: IUsersPasswords[] = [
          {
            ...usersPasswords,
          },
          { id: '1361f429-3817-4123-8ee3-fdf8943310b2' },
        ];
        expectedResult = service.addUsersPasswordsToCollectionIfMissing(usersPasswordsCollection, usersPasswords);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a UsersPasswords to an array that doesn't contain it", () => {
        const usersPasswords: IUsersPasswords = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const usersPasswordsCollection: IUsersPasswords[] = [{ id: '1361f429-3817-4123-8ee3-fdf8943310b2' }];
        expectedResult = service.addUsersPasswordsToCollectionIfMissing(usersPasswordsCollection, usersPasswords);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(usersPasswords);
      });

      it('should add only unique UsersPasswords to an array', () => {
        const usersPasswordsArray: IUsersPasswords[] = [
          { id: '9fec3727-3421-4967-b213-ba36557ca194' },
          { id: '1361f429-3817-4123-8ee3-fdf8943310b2' },
          { id: 'bd09e03d-a8bf-424c-9a01-70523c8bd0ea' },
        ];
        const usersPasswordsCollection: IUsersPasswords[] = [{ id: '9fec3727-3421-4967-b213-ba36557ca194' }];
        expectedResult = service.addUsersPasswordsToCollectionIfMissing(usersPasswordsCollection, ...usersPasswordsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const usersPasswords: IUsersPasswords = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const usersPasswords2: IUsersPasswords = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        expectedResult = service.addUsersPasswordsToCollectionIfMissing([], usersPasswords, usersPasswords2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(usersPasswords);
        expect(expectedResult).toContain(usersPasswords2);
      });

      it('should accept null and undefined values', () => {
        const usersPasswords: IUsersPasswords = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        expectedResult = service.addUsersPasswordsToCollectionIfMissing([], null, usersPasswords, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(usersPasswords);
      });

      it('should return initial array if no UsersPasswords is added', () => {
        const usersPasswordsCollection: IUsersPasswords[] = [{ id: '9fec3727-3421-4967-b213-ba36557ca194' }];
        expectedResult = service.addUsersPasswordsToCollectionIfMissing(usersPasswordsCollection, undefined, null);
        expect(expectedResult).toEqual(usersPasswordsCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
