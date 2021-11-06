import { TestBed } from '@angular/core/testing';

import { AddKeyService } from './add-key.service';

describe('AddKeyService', () => {
  let service: AddKeyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddKeyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
