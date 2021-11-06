import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UsersPasswordsComponent } from './list/users-passwords.component';
import { UsersPasswordsDetailComponent } from './detail/users-passwords-detail.component';
import { UsersPasswordsUpdateComponent } from './update/users-passwords-update.component';
import { UsersPasswordsDeleteDialogComponent } from './delete/users-passwords-delete-dialog.component';
import { UsersPasswordsRoutingModule } from './route/users-passwords-routing.module';

@NgModule({
  imports: [SharedModule, UsersPasswordsRoutingModule],
  declarations: [
    UsersPasswordsComponent,
    UsersPasswordsDetailComponent,
    UsersPasswordsUpdateComponent,
    UsersPasswordsDeleteDialogComponent,
  ],
  entryComponents: [UsersPasswordsDeleteDialogComponent],
})
export class UsersPasswordsModule {}
