import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUsersPasswords, UsersPasswords } from '../users-passwords.model';
import { UsersPasswordsService } from '../service/users-passwords.service';

@Injectable({ providedIn: 'root' })
export class UsersPasswordsRoutingResolveService implements Resolve<IUsersPasswords> {
  constructor(protected service: UsersPasswordsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUsersPasswords> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((usersPasswords: HttpResponse<UsersPasswords>) => {
          if (usersPasswords.body) {
            return of(usersPasswords.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new UsersPasswords());
  }
}
