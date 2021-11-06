import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { UsersPasswordsDetailComponent } from './users-passwords-detail.component';

describe('UsersPasswords Management Detail Component', () => {
  let comp: UsersPasswordsDetailComponent;
  let fixture: ComponentFixture<UsersPasswordsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsersPasswordsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ usersPasswords: { id: '9fec3727-3421-4967-b213-ba36557ca194' } }) },
        },
      ],
    })
      .overrideTemplate(UsersPasswordsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(UsersPasswordsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load usersPasswords on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.usersPasswords).toEqual(expect.objectContaining({ id: '9fec3727-3421-4967-b213-ba36557ca194' }));
    });
  });
});
