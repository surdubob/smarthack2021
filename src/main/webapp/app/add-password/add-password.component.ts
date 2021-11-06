import { Component, OnInit } from '@angular/core';
import { UsersPasswords } from '../entities/users-passwords/users-passwords.model';
import { AccountService } from '../core/auth/account.service';
import { UsersPasswordsService } from '../entities/users-passwords/service/users-passwords.service';

@Component({
  selector: 'jhi-add-password',
  templateUrl: './add-password.component.html',
  styleUrls: ['./add-password.component.scss'],
})
export class AddPasswordComponent {
  generateHidden = false;
  platform = '';
  password = '';
  length = '';
  specialCh = false;

  constructor(private userPasswordsService: UsersPasswordsService, private accountService: AccountService) {
    // empty
  }

  buttonGenerateOnClick(): void {
    this.generateHidden = !this.generateHidden;
  }

  //  generate_password(){
  //    const password = new UsersPasswords();
  //    if(this.generateHidden){
  //
  //    }
  // }

  save_password(): void {
    const password = new UsersPasswords();
    this.accountService.getAuthenticationState().subscribe(account => {
      if (account) {
        password.user = account;
        password.type = 'Password';
        password.platform = this.platform;
        password.secret = this.password;
        // eslint-disable-next-line no-console
        this.userPasswordsService.create(password).subscribe(response => console.log(response));
      }
    });
  }
}
