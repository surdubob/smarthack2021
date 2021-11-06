import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IUsersPasswords } from '../users-passwords.model';
import { UsersPasswordsService } from '../service/users-passwords.service';
import { UsersPasswordsDeleteDialogComponent } from '../delete/users-passwords-delete-dialog.component';

@Component({
  selector: 'jhi-users-passwords',
  templateUrl: './users-passwords.component.html',
})
export class UsersPasswordsComponent implements OnInit {
  usersPasswords?: IUsersPasswords[];
  isLoading = false;

  constructor(protected usersPasswordsService: UsersPasswordsService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.usersPasswordsService.query().subscribe(
      (res: HttpResponse<IUsersPasswords[]>) => {
        this.isLoading = false;
        this.usersPasswords = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IUsersPasswords): string {
    return item.id!;
  }

  delete(usersPasswords: IUsersPasswords): void {
    const modalRef = this.modalService.open(UsersPasswordsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.usersPasswords = usersPasswords;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
