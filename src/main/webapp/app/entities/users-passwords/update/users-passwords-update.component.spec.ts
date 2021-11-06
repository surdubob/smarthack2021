jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { UsersPasswordsService } from '../service/users-passwords.service';
import { IUsersPasswords, UsersPasswords } from '../users-passwords.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { UsersPasswordsUpdateComponent } from './users-passwords-update.component';

describe('UsersPasswords Management Update Component', () => {
  let comp: UsersPasswordsUpdateComponent;
  let fixture: ComponentFixture<UsersPasswordsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let usersPasswordsService: UsersPasswordsService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [UsersPasswordsUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(UsersPasswordsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UsersPasswordsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    usersPasswordsService = TestBed.inject(UsersPasswordsService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const usersPasswords: IUsersPasswords = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const user: IUser = { id: 50740 };
      usersPasswords.user = user;

      const userCollection: IUser[] = [{ id: 92863 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ usersPasswords });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const usersPasswords: IUsersPasswords = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const user: IUser = { id: 90731 };
      usersPasswords.user = user;

      activatedRoute.data = of({ usersPasswords });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(usersPasswords));
      expect(comp.usersSharedCollection).toContain(user);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<UsersPasswords>>();
      const usersPasswords = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(usersPasswordsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ usersPasswords });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: usersPasswords }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(usersPasswordsService.update).toHaveBeenCalledWith(usersPasswords);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<UsersPasswords>>();
      const usersPasswords = new UsersPasswords();
      jest.spyOn(usersPasswordsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ usersPasswords });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: usersPasswords }));
      saveSubject.complete();

      // THEN
      expect(usersPasswordsService.create).toHaveBeenCalledWith(usersPasswords);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<UsersPasswords>>();
      const usersPasswords = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(usersPasswordsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ usersPasswords });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(usersPasswordsService.update).toHaveBeenCalledWith(usersPasswords);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackUserById', () => {
      it('Should return tracked User primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackUserById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
