import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UsersPasswordsComponent } from '../list/users-passwords.component';
import { UsersPasswordsDetailComponent } from '../detail/users-passwords-detail.component';
import { UsersPasswordsUpdateComponent } from '../update/users-passwords-update.component';
import { UsersPasswordsRoutingResolveService } from './users-passwords-routing-resolve.service';

const usersPasswordsRoute: Routes = [
  {
    path: '',
    component: UsersPasswordsComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UsersPasswordsDetailComponent,
    resolve: {
      usersPasswords: UsersPasswordsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UsersPasswordsUpdateComponent,
    resolve: {
      usersPasswords: UsersPasswordsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UsersPasswordsUpdateComponent,
    resolve: {
      usersPasswords: UsersPasswordsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(usersPasswordsRoute)],
  exports: [RouterModule],
})
export class UsersPasswordsRoutingModule {}
