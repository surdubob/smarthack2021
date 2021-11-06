import { Component, Input, OnInit } from '@angular/core';
import { UsersPasswordsService } from '../entities/users-passwords/service/users-passwords.service';
import { UsersPasswords } from '../entities/users-passwords/users-passwords.model';
import { AccountService } from '../core/auth/account.service';
import { HttpClient } from '@angular/common/http';
import { AddKeyService } from '../add-key.service';
import { Router } from '@angular/router';

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
    private addKeyService: AddKeyService,
    private routerService: Router
  ) {
    // empty
  }

  save_key(): void {
    if (this.keyValue === '' || this.inputGroup === '' || this.platform === '') {
      alert('Please fill all the date required');
    } else {
      const password = new UsersPasswords();
      this.accountService.getAuthenticationState().subscribe(account => {
        if (account) {
          password.user = account;
          password.type = this.inputGroup;
          password.platform = this.platform;
          password.secret = this.keyValue;
          // eslint-disable-next-line no-console
          this.userPasswordsService.create(password).subscribe(response => console.log(response));
          this.routerService.navigate(['/']);
        }
      });
    }
  }

  generate_key(): void {
    this.addKeyService.generateKey(this.inputGroup).subscribe(r => {
      // eslint-disable-next-line no-console
      console.log(r);
      this.keyValue = r;
    });
  }
}
