import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IUsersPasswords } from '../users-passwords.model';
import { UsersPasswordsService } from '../service/users-passwords.service';

@Component({
  templateUrl: './users-passwords-delete-dialog.component.html',
})
export class UsersPasswordsDeleteDialogComponent {
  usersPasswords?: IUsersPasswords;

  constructor(protected usersPasswordsService: UsersPasswordsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.usersPasswordsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
