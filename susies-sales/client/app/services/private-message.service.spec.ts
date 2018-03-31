import { TestBed, inject } from '@angular/core/testing';

import { PrivateMessageService } from './private-message.service';

describe('PrivateMessageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrivateMessageService]
    });
  });

  it('should be created', inject([PrivateMessageService], (service: PrivateMessageService) => {
    expect(service).toBeTruthy();
  }));
});
