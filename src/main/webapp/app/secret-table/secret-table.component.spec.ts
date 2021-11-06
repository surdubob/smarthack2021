import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretTableComponent } from './secret-table.component';

describe('SecretTableComponent', () => {
  let component: SecretTableComponent;
  let fixture: ComponentFixture<SecretTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SecretTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecretTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
