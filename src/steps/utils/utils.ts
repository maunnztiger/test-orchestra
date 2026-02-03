import * as yaml from "js-yaml";
import * as fs from "fs";

export function loadTestData<T = any>() {
  const fileContents = fs.readFileSync("./resources/test_data.yaml", "utf-8");
  const data = yaml.load(fileContents);
  if (!data) {
    throw new Error(`YAML-Datei ist leer oder ungültig`);
  }
  return data as T;
}
