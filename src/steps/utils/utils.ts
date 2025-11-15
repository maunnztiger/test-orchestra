import * as yaml from "js-yaml";
import * as fs from "fs";

export function loadConfigFile<T = any>() {
  const fileContents = fs.readFileSync("./resources/config.yaml", "utf-8");
  const data = yaml.load(fileContents);
  if (!data) {
    throw new Error(`YAML-Datei ist leer oder ungültig`);
  }
  return data as T;
}
