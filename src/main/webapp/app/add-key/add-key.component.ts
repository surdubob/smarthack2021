import { Component, OnInit } from '@angular/core';
import { UsersPasswordsService } from '../entities/users-passwords/service/users-passwords.service';
import { UsersPasswords } from '../entities/users-passwords/users-passwords.model';
import { AccountService } from '../core/auth/account.service';
import { HttpClient } from '@angular/common/http';
import { AddKeyService } from '../add-key.service';

@Component({
  selector: 'jhi-add-key',
  templateUrl: './add-key.component.html',
  styleUrls: ['./add-key.component.scss'],
})
export class AddKeyComponent {
  keyValue = '';
  inputGroup = '';
  platform = '';
  constructor(
    private userPasswordsService: UsersPasswordsService,
    private accountService: AccountService,
    private addKeyService: AddKeyService
  ) {
    // empty
  }

  save_key(): void {
    const password = new UsersPasswords();
    this.accountService.getAuthenticationState().subscribe(account => {
      if (account) {
        password.user = account;
        password.type = this.inputGroup;
        password.platform = this.platform;
        password.secret = this.keyValue;
        // eslint-disable-next-line no-console
        this.userPasswordsService.create(password).subscribe(response => console.log(response));
      }
    });
  }

  generate_key(): void {
    this.addKeyService.generateKey(this.inputGroup).subscribe(r => {
      // eslint-disable-next-line no-console
      console.log(r);
      this.keyValue = r;
    });
  }
}
