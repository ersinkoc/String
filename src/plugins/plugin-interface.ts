import type { IStringPlugin, StringCore } from '../types';

export class StringCoreImpl implements StringCore {
  private plugins: Map<string, IStringPlugin> = new Map();
  private extensions: Map<string, Function> = new Map();

  use(plugin: IStringPlugin): void {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin ${plugin.name} is already installed`);
    }
    
    // Install plugin first, only add to registry if successful
    plugin.install(this);
    this.plugins.set(plugin.name, plugin);
  }

  extend(name: string, fn: Function): void {
    if (this.extensions.has(name)) {
      throw new Error(`Extension ${name} already exists`);
    }
    
    this.extensions.set(name, fn);
  }

  getExtension(name: string): Function | undefined {
    return this.extensions.get(name);
  }

  getPlugin(name: string): IStringPlugin | undefined {
    return this.plugins.get(name);
  }

  listPlugins(): string[] {
    return Array.from(this.plugins.keys());
  }

  listExtensions(): string[] {
    return Array.from(this.extensions.keys());
  }
}

export function createPlugin(
  name: string,
  version: string,
  installer: (core: StringCore) => void
): IStringPlugin {
  return {
    name,
    version,
    install: installer
  };
}

// Example plugin implementations
export const localePlugin = createPlugin(
  'locale',
  '1.0.0',
  (core: StringCore) => {
    core.extend('toLocaleLowerCase', (str: string, locale: string) => {
      return str.toLocaleLowerCase(locale);
    });
    
    core.extend('toLocaleUpperCase', (str: string, locale: string) => {
      return str.toLocaleUpperCase(locale);
    });
    
    core.extend('localeCompare', (str1: string, str2: string, locale: string) => {
      return str1.localeCompare(str2, locale);
    });
  }
);

export const colorPlugin = createPlugin(
  'color',
  '1.0.0',
  (core: StringCore) => {
    core.extend('colorize', (str: string, color: string) => {
      const colors: Record<string, string> = {
        red: '\x1b[31m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        magenta: '\x1b[35m',
        cyan: '\x1b[36m',
        white: '\x1b[37m',
        reset: '\x1b[0m'
      };
      
      return `${colors[color] || ''}${str}${colors['reset']}`;
    });
    
    core.extend('stripColors', (str: string) => {
      return str.replace(/\x1b\[[0-9;]*m/g, '');
    });
  }
);

export const mathPlugin = createPlugin(
  'math',
  '1.0.0',
  (core: StringCore) => {
    core.extend('extractNumbers', (str: string) => {
      return str.match(/-?\d+(?:\.\d+)?/g)?.map(Number) || [];
    });
    
    core.extend('sumNumbers', (str: string) => {
      const numbers = str.match(/-?\d+(?:\.\d+)?/g)?.map(Number) || [];
      return numbers.reduce((sum, num) => sum + num, 0);
    });
    
    core.extend('replaceNumbers', (str: string, replacer: (num: number) => string) => {
      return str.replace(/-?\d+(?:\.\d+)?/g, (match) => {
        return replacer(parseFloat(match));
      });
    });
  }
);