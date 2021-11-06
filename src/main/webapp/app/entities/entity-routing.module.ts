import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'users-passwords',
        data: { pageTitle: 'smarthack2021App.usersPasswords.home.title' },
        loadChildren: () => import('./users-passwords/users-passwords.module').then(m => m.UsersPasswordsModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
