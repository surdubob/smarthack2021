import { TestBed } from '@angular/core/testing';

import { AddPasswordService } from './add-password.service';

describe('AddPasswordService', () => {
  let service: AddPasswordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddPasswordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
