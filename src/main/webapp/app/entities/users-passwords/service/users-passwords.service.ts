import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUsersPasswords, getUsersPasswordsIdentifier } from '../users-passwords.model';

export type EntityResponseType = HttpResponse<IUsersPasswords>;
export type EntityArrayResponseType = HttpResponse<IUsersPasswords[]>;

@Injectable({ providedIn: 'root' })
export class UsersPasswordsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/users-passwords');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(usersPasswords: IUsersPasswords): Observable<EntityResponseType> {
    return this.http.post<IUsersPasswords>(this.resourceUrl, usersPasswords, { observe: 'response' });
  }

  update(usersPasswords: IUsersPasswords): Observable<EntityResponseType> {
    return this.http.put<IUsersPasswords>(`${this.resourceUrl}/${getUsersPasswordsIdentifier(usersPasswords) as string}`, usersPasswords, {
      observe: 'response',
    });
  }

  partialUpdate(usersPasswords: IUsersPasswords): Observable<EntityResponseType> {
    return this.http.patch<IUsersPasswords>(
      `${this.resourceUrl}/${getUsersPasswordsIdentifier(usersPasswords) as string}`,
      usersPasswords,
      { observe: 'response' }
    );
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IUsersPasswords>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUsersPasswords[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addUsersPasswordsToCollectionIfMissing(
    usersPasswordsCollection: IUsersPasswords[],
    ...usersPasswordsToCheck: (IUsersPasswords | null | undefined)[]
  ): IUsersPasswords[] {
    const usersPasswords: IUsersPasswords[] = usersPasswordsToCheck.filter(isPresent);
    if (usersPasswords.length > 0) {
      const usersPasswordsCollectionIdentifiers = usersPasswordsCollection.map(
        usersPasswordsItem => getUsersPasswordsIdentifier(usersPasswordsItem)!
      );
      const usersPasswordsToAdd = usersPasswords.filter(usersPasswordsItem => {
        const usersPasswordsIdentifier = getUsersPasswordsIdentifier(usersPasswordsItem);
        if (usersPasswordsIdentifier == null || usersPasswordsCollectionIdentifiers.includes(usersPasswordsIdentifier)) {
          return false;
        }
        usersPasswordsCollectionIdentifiers.push(usersPasswordsIdentifier);
        return true;
      });
      return [...usersPasswordsToAdd, ...usersPasswordsCollection];
    }
    return usersPasswordsCollection;
  }
}
