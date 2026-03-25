import { Injectable } from '@angular/core';
import { SCAMMER_DATA, _k } from './scammer-data';

export interface Scammer {
  name: string;
  tag: string;
  detail?: string;
  letter: string;
}

@Injectable({ providedIn: 'root' })
export class ScammerService {
  private decoded: Record<string, { name: string; tag: string; detail?: string }[]> | null = null;

  private stripNoise(str: string): string {
    const noiseSet = new Set('!@#$%^&*~`'.split(''));
    let result = '';
    let noiseCount = 0;
    for (let i = 0; i < str.length; i++) {
      if (noiseSet.has(str[i]) && i > 0 && noiseCount < Math.floor(i / 7)) {
        noiseCount++;
        continue;
      }
      result += str[i];
    }
    return result;
  }

  private xorDecode(str: string, key: string): string {
    return Array.from(str).map((c, i) =>
      String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
    ).join('');
  }

  private rot13(str: string): string {
    return str.replace(/[a-zA-Z]/g, c => {
      const base = c <= 'Z' ? 65 : 97;
      return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
    });
  }

  private b64ToBinary(b64: string): string {
    const binary = atob(b64);
    return binary;
  }

  getData(): Scammer[] {
    if (this.decoded) {
      return this.flattenData(this.decoded);
    }

    try {
      const cleaned = this.stripNoise(SCAMMER_DATA);
      const binary = this.b64ToBinary(cleaned);
      const rot13ed = this.xorDecode(binary, _k);
      const jsonStr = this.rot13(rot13ed);
      this.decoded = JSON.parse(jsonStr);
      return this.flattenData(this.decoded!);
    } catch (e) {
      console.error('Failed to decode scammer data', e);
      return [];
    }
  }

  private flattenData(data: Record<string, { name: string; tag: string; detail?: string }[]>): Scammer[] {
    const result: Scammer[] = [];
    for (const letter of Object.keys(data).sort()) {
      for (const item of data[letter]) {
        result.push({ ...item, letter });
      }
    }
    return result;
  }
}
