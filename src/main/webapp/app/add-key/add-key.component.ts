import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UsersPasswordsService } from '../entities/users-passwords/service/users-passwords.service';
import { UsersPasswords } from '../entities/users-passwords/users-passwords.model';
import { AccountService } from '../core/auth/account.service';
import { HttpClient } from '@angular/common/http';
import { AddKeyService } from '../add-key.service';
import { Router } from '@angular/router';
import { LoginService } from '../login/login.service';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'jhi-add-key',
  templateUrl: './add-key.component.html',
  styleUrls: ['./add-key.component.scss'],
})
export class AddKeyComponent {
  keyValue = '';
  inputGroup = '';
  platform = '';
  subs: Subscription | undefined;

  constructor(
    private userPasswordsService: UsersPasswordsService,
    private addKeyService: AddKeyService,
    private routerService: Router,
    private accountService: AccountService
  ) {
    // empty
  }

  save_key(): void {
    if (this.keyValue === '' || this.inputGroup === '' || this.platform === '') {
      alert('Please fill all the date required');
    } else {
      const password = new UsersPasswords();
      password.user = this.accountService.getCurrentUser();
      if (password.user != null) {
        // eslint-disable-next-line no-console
        console.log(password.user);
        password.type = this.inputGroup;
        password.platform = this.platform;
        password.secret = this.keyValue;
        // eslint-disable-next-line no-console
        this.subs = this.userPasswordsService
          .create(password)
          .pipe(first())
          .subscribe(response => {
            // eslint-disable-next-line no-console
            console.log(response);
          });
        this.routerService.navigate(['/']);
      }
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
