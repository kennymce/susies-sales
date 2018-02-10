import { TestBed, inject } from '@angular/core/testing';

import { GimmieService } from './gimmie.service';

describe('GimmieService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GimmieService]
    });
  });

  it('should be created', inject([GimmieService], (service: GimmieService) => {
    expect(service).toBeTruthy();
  }));
});
