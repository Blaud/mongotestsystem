import { TestBed } from '@angular/core/testing';

import { UserstatisticService } from './userstatistic.service';

describe('UserstatisticService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserstatisticService = TestBed.get(UserstatisticService);
    expect(service).toBeTruthy();
  });
});
