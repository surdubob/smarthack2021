import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { UsersPasswordsService } from '../service/users-passwords.service';

import { UsersPasswordsComponent } from './users-passwords.component';

describe('UsersPasswords Management Component', () => {
  let comp: UsersPasswordsComponent;
  let fixture: ComponentFixture<UsersPasswordsComponent>;
  let service: UsersPasswordsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [UsersPasswordsComponent],
    })
      .overrideTemplate(UsersPasswordsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UsersPasswordsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(UsersPasswordsService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: '9fec3727-3421-4967-b213-ba36557ca194' }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.usersPasswords?.[0]).toEqual(expect.objectContaining({ id: '9fec3727-3421-4967-b213-ba36557ca194' }));
  });
});
