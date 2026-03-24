export class Table {
  constructor(private raw: string[][]) {}

  // Erste Spalte als Liste
  asList(): string[] {
    return this.raw.slice(1).map(row => row[0]);
  }

  // Tabelle als Array von Objekten
  asObjects(): Record<string, string>[] {
    const [headers, ...rows] = this.raw;

    return rows.map(row => {
      const obj: Record<string, string> = {};

      headers.forEach((header, i) => {
        obj[header] = row[i];
      });

      return obj;
    });
  }

  // Optional: Zugriff auf rohe Daten
  rawData(): string[][] {
    return this.raw;
  }
}
