
import { Component, inject, OnInit, signal } from "@angular/core";
import { DatePipe, DecimalPipe } from "@angular/common";

import { TestRuns } from "./services/test-runs";
import { TestRun } from "./models/test-run.model";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [DatePipe, DecimalPipe],
  templateUrl: "./app.html",
  styleUrl: "./app.scss"
})
export class App implements OnInit {
  private readonly testRunsService = inject(TestRuns);

  readonly runs = signal<TestRun[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.testRunsService.getRuns().subscribe({
      next: (data) => {
        this.runs.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error("Failed to load runs:", err);
        this.error.set("Testläufe konnten nicht geladen werden.");
        this.loading.set(false);
      }
    });
  }
}
