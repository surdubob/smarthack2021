import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsersPasswords } from '../entities/users-passwords/users-passwords.model';
import { AccountService } from '../core/auth/account.service';
import { UsersPasswordsService } from '../entities/users-passwords/service/users-passwords.service';
import { AddPasswordService } from '../add-password.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'jhi-add-password',
  templateUrl: './add-password.component.html',
  styleUrls: ['./add-password.component.scss'],
})
export class AddPasswordComponent {
  generateHidden = false;
  platform = '';
  password = '';
  length = 16;
  specialCh = false;
  subs: Subscription | undefined;

  constructor(
    private userPasswordsService: UsersPasswordsService,
    private accountService: AccountService,
    private addPasswordService: AddPasswordService,
    private routerService: Router
  ) {
    // empty
  }

  buttonGenerateOnClick(): void {
    this.generateHidden = !this.generateHidden;
  }

  generate_password(): void {
    this.addPasswordService.generatePassword(this.length, this.specialCh).subscribe(r => {
      // eslint-disable-next-line no-console
      console.log(r);
      this.password = r;
    });
  }

  save_password(): void {
    if (this.password === '' || this.platform === '') {
      alert('Please fill all the data required');
    } else {
      const password = new UsersPasswords();
      const passwd = new UsersPasswords();
      passwd.user = this.accountService.getCurrentUser();
      if (passwd.user != null) {
        // eslint-disable-next-line no-console
        console.log(passwd.user);
        passwd.type = 'Password';
        passwd.platform = this.platform;
        passwd.secret = this.password;
        // eslint-disable-next-line no-console
        this.userPasswordsService
          .create(passwd)
          .pipe(first())
          .subscribe(response => {
            // eslint-disable-next-line no-console
            console.log(response);
          });
        this.routerService.navigate(['/']);
      }
    }
  }
}
