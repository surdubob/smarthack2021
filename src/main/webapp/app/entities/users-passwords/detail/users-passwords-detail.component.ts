import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUsersPasswords } from '../users-passwords.model';

@Component({
  selector: 'jhi-users-passwords-detail',
  templateUrl: './users-passwords-detail.component.html',
})
export class UsersPasswordsDetailComponent implements OnInit {
  usersPasswords: IUsersPasswords | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ usersPasswords }) => {
      this.usersPasswords = usersPasswords;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
