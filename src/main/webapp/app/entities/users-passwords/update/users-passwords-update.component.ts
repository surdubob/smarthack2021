import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IUsersPasswords, UsersPasswords } from '../users-passwords.model';
import { UsersPasswordsService } from '../service/users-passwords.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-users-passwords-update',
  templateUrl: './users-passwords-update.component.html',
})
export class UsersPasswordsUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    secret: [],
    type: [],
    platform: [],
    user: [],
  });

  constructor(
    protected usersPasswordsService: UsersPasswordsService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ usersPasswords }) => {
      this.updateForm(usersPasswords);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const usersPasswords = this.createFromForm();
    if (usersPasswords.id !== undefined) {
      this.subscribeToSaveResponse(this.usersPasswordsService.update(usersPasswords));
    } else {
      this.subscribeToSaveResponse(this.usersPasswordsService.create(usersPasswords));
    }
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUsersPasswords>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(usersPasswords: IUsersPasswords): void {
    this.editForm.patchValue({
      id: usersPasswords.id,
      secret: usersPasswords.secret,
      type: usersPasswords.type,
      platform: usersPasswords.platform,
      user: usersPasswords.user,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, usersPasswords.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IUsersPasswords {
    return {
      ...new UsersPasswords(),
      id: this.editForm.get(['id'])!.value,
      secret: this.editForm.get(['secret'])!.value,
      type: this.editForm.get(['type'])!.value,
      platform: this.editForm.get(['platform'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
