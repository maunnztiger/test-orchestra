import { TestBed } from '@angular/core/testing';
import { TestRuns } from './test-runs';

describe('TestRuns', () => {
  let service: TestRuns;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestRuns);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
