import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { UsersPasswordsService } from '../entities/users-passwords/service/users-passwords.service';
import { HomeService } from '../home.service';
import { IUsersPasswords, UsersPasswords } from '../entities/users-passwords/users-passwords.model';
import { UsersPasswordsDeleteDialogComponent } from '../entities/users-passwords/delete/users-passwords-delete-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  isLoading = false;
  searchString = '';
  passwordList: UsersPasswords[] = [];
  filteredList: UsersPasswords[] = [];
  account: Account | null = null;
  shownId: string | undefined = '';

  private readonly destroy$ = new Subject<void>();

  constructor(
    private accountService: AccountService,
    private router: Router,
    private usersPasswordsService: HomeService,
    protected modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => {
        this.account = account;
        this.loadAll();
      });
  }

  changeSearch(): void {
    this.filteredList = this.passwordList.filter(value => {
      if (value.platform?.includes(this.searchString)) {
        return 1;
      }
      return 0;
    });
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public loadAll(): void {
    this.isLoading = true;
    this.usersPasswordsService.getAllPasswords().subscribe(r => {
      this.passwordList = r;
      this.filteredList = r;
    });
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

  copyMessage(val: string | null | undefined): void {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    if (val !== null && val !== undefined) {
      selBox.value = val;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
    }
  }
}
