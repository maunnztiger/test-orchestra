import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { TestRun } from '../models/test-run.model';

@Injectable({
  providedIn: 'root',
})
export class TestRuns {
  private readonly http = inject(HttpClient);

  getRuns(): Observable<TestRun[]> {
    return this.http.get<TestRun[]>('/api/runs');
  }
}
