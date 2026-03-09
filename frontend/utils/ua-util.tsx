// utils/ua-util.ts
import { UAParser } from "ua-parser-js";

export interface UAInfo {
  browser: { name?: string; version?: string };
  os: { name?: string; version?: string };
  device: { vendor?: string; model?: string; type?: string };
  engine: { name?: string; version?: string };
  cpu: { architecture?: string };
  raw: string;
}

export function parseUserAgent(uaString: string): UAInfo {
  const parser = new UAParser(uaString);
  const result = parser.getResult();

  return {
    browser: result.browser,
    os: result.os,
    device: result.device,
    engine: result.engine,
    cpu: result.cpu,
    raw: uaString,
  };
}
