import { TestBed } from '@angular/core/testing';

import { MyCustomPagenatorInit } from './my-custom-pagenator-init';

describe('MyCustomPagenatorInit', () => {
  let service: MyCustomPagenatorInit;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyCustomPagenatorInit);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
