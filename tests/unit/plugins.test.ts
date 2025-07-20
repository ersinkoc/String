import { 
  StringCoreImpl, 
  createPlugin, 
  localePlugin, 
  colorPlugin, 
  mathPlugin 
} from '../../src/plugins/plugin-interface';

describe('Plugin System', () => {
  let core: StringCoreImpl;

  beforeEach(() => {
    core = new StringCoreImpl();
  });

  describe('StringCoreImpl', () => {
    it('should create core instance', () => {
      expect(core).toBeInstanceOf(StringCoreImpl);
    });

    it('should start with empty plugins and extensions', () => {
      expect(core.listPlugins()).toEqual([]);
      expect(core.listExtensions()).toEqual([]);
    });

    it('should allow plugin installation', () => {
      const testPlugin = createPlugin('test', '1.0.0', (core) => {
        core.extend('testMethod', (str: string) => str.toUpperCase());
      });

      core.use(testPlugin);
      expect(core.listPlugins()).toContain('test');
      expect(core.listExtensions()).toContain('testMethod');
    });

    it('should prevent duplicate plugin installation', () => {
      const testPlugin = createPlugin('test', '1.0.0', () => {});
      
      core.use(testPlugin);
      expect(() => core.use(testPlugin)).toThrow('Plugin test is already installed');
    });

    it('should allow extension registration', () => {
      core.extend('myMethod', (str: string) => str.repeat(2));
      
      expect(core.listExtensions()).toContain('myMethod');
      expect(core.getExtension('myMethod')).toBeInstanceOf(Function);
    });

    it('should prevent duplicate extension registration', () => {
      core.extend('myMethod', () => {});
      expect(() => core.extend('myMethod', () => {})).toThrow('Extension myMethod already exists');
    });

    it('should retrieve plugins and extensions', () => {
      const testPlugin = createPlugin('test', '1.0.0', (core) => {
        core.extend('testMethod', () => 'test');
      });

      core.use(testPlugin);

      expect(core.getPlugin('test')).toBe(testPlugin);
      expect(core.getPlugin('nonexistent')).toBeUndefined();
      
      const extension = core.getExtension('testMethod');
      expect(extension).toBeInstanceOf(Function);
      expect(core.getExtension('nonexistent')).toBeUndefined();
    });
  });

  describe('createPlugin', () => {
    it('should create plugin with correct properties', () => {
      const plugin = createPlugin('test', '1.0.0', () => {});
      
      expect(plugin.name).toBe('test');
      expect(plugin.version).toBe('1.0.0');
      expect(plugin.install).toBeInstanceOf(Function);
    });

    it('should call installer function when used', () => {
      const installer = jest.fn();
      const plugin = createPlugin('test', '1.0.0', installer);
      
      core.use(plugin);
      expect(installer).toHaveBeenCalledWith(core);
    });
  });

  describe('Built-in Plugins', () => {
    describe('localePlugin', () => {
      beforeEach(() => {
        core.use(localePlugin);
      });

      it('should add locale methods', () => {
        expect(core.listExtensions()).toContain('toLocaleLowerCase');
        expect(core.listExtensions()).toContain('toLocaleUpperCase');
        expect(core.listExtensions()).toContain('localeCompare');
      });

      it('should provide working locale methods', () => {
        const toLowerCase = core.getExtension('toLocaleLowerCase');
        const toUpperCase = core.getExtension('toLocaleUpperCase');
        const localeCompare = core.getExtension('localeCompare');

        if (toLowerCase && toUpperCase && localeCompare) {
          expect(toLowerCase('HELLO', 'en')).toBe('hello');
          expect(toUpperCase('hello', 'en')).toBe('HELLO');
          expect(typeof localeCompare('a', 'b', 'en')).toBe('number');
        }
      });
    });

    describe('colorPlugin', () => {
      beforeEach(() => {
        core.use(colorPlugin);
      });

      it('should add color methods', () => {
        expect(core.listExtensions()).toContain('colorize');
        expect(core.listExtensions()).toContain('stripColors');
      });

      it('should colorize text', () => {
        const colorize = core.getExtension('colorize');
        
        if (colorize) {
          const result = colorize('hello', 'red');
          expect(result).toContain('\x1b[31m');
          expect(result).toContain('hello');
          expect(result).toContain('\x1b[0m');
        }
      });

      it('should strip colors', () => {
        const stripColors = core.getExtension('stripColors');
        
        if (stripColors) {
          const colored = '\x1b[31mhello\x1b[0m';
          expect(stripColors(colored)).toBe('hello');
        }
      });

      it('🎯 should hit line 89: handle unknown color', () => {
        const colorize = core.getExtension('colorize');
        
        if (colorize) {
          const result = colorize('Test', 'unknowncolor'); // Hits line 89 fallback
          expect(result).toContain('Test');
          expect(result).toContain('\x1b[0m'); // Should still include reset
        }
      });
    });

    describe('mathPlugin', () => {
      beforeEach(() => {
        core.use(mathPlugin);
      });

      it('should add math methods', () => {
        expect(core.listExtensions()).toContain('extractNumbers');
        expect(core.listExtensions()).toContain('sumNumbers');
        expect(core.listExtensions()).toContain('replaceNumbers');
      });

      it('should extract numbers', () => {
        const extractNumbers = core.getExtension('extractNumbers');
        
        if (extractNumbers) {
          expect(extractNumbers('I have 5 apples and 3 oranges')).toEqual([5, 3]);
          expect(extractNumbers('Price: $12.50')).toEqual([12.50]);
          expect(extractNumbers('No numbers here')).toEqual([]);
        }
      });

      it('should sum numbers', () => {
        const sumNumbers = core.getExtension('sumNumbers');
        
        if (sumNumbers) {
          expect(sumNumbers('1 + 2 + 3 = 6')).toBe(12); // 1+2+3+6
          expect(sumNumbers('Price: $12.50 + $7.25')).toBe(19.75);
          expect(sumNumbers('No numbers')).toBe(0);
        }
      });

      it('should replace numbers', () => {
        const replaceNumbers = core.getExtension('replaceNumbers');
        
        if (replaceNumbers) {
          const result = replaceNumbers('I have 5 items', (num: number) => `[${num}]`);
          expect(result).toBe('I have [5] items');
          
          const doubled = replaceNumbers('1 and 2', (num: number) => String(num * 2));
          expect(doubled).toBe('2 and 4');
        }
      });
    });
  });

  describe('Plugin Integration', () => {
    it('should work with multiple plugins', () => {
      core.use(localePlugin);
      core.use(colorPlugin);
      core.use(mathPlugin);

      expect(core.listPlugins()).toEqual(['locale', 'color', 'math']);
      expect(core.listExtensions().length).toBeGreaterThan(5);
    });

    it('should allow custom plugin composition', () => {
      // Create a plugin that uses other plugins
      const compositePlugin = createPlugin('composite', '1.0.0', (core) => {
        core.extend('processText', (str: string) => {
          const colorize = core.getExtension('colorize');
          const extractNumbers = core.getExtension('extractNumbers');
          
          if (colorize && extractNumbers) {
            const numbers = extractNumbers(str);
            if (numbers.length > 0) {
              return colorize(str, 'green');
            }
          }
          return str;
        });
      });

      core.use(colorPlugin);
      core.use(mathPlugin);
      core.use(compositePlugin);

      const processText = core.getExtension('processText');
      if (processText) {
        const result = processText('I have 5 items');
        expect(result).toContain('\x1b[32m'); // green color
      }
    });

    it('should handle plugin dependencies gracefully', () => {
      const dependentPlugin = createPlugin('dependent', '1.0.0', (core) => {
        core.extend('safeColorize', (str: string, color: string) => {
          const colorize = core.getExtension('colorize');
          return colorize ? colorize(str, color) : str;
        });
      });

      core.use(dependentPlugin);
      
      const safeColorize = core.getExtension('safeColorize');
      if (safeColorize) {
        // Should work without colorPlugin
        expect(safeColorize('hello', 'red')).toBe('hello');
        
        // Should work with colorPlugin
        core.use(colorPlugin);
        expect(safeColorize('hello', 'red')).toContain('\x1b[31m');
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle plugin installation errors gracefully', () => {
      const buggyPlugin = createPlugin('buggy', '1.0.0', () => {
        throw new Error('Plugin installation failed');
      });

      expect(() => core.use(buggyPlugin)).toThrow('Plugin installation failed');
      expect(core.listPlugins()).not.toContain('buggy');
    });

    it('should handle extension execution errors gracefully', () => {
      core.extend('buggyMethod', () => {
        throw new Error('Extension execution failed');
      });

      const buggyMethod = core.getExtension('buggyMethod');
      expect(buggyMethod).toBeInstanceOf(Function);
      
      if (buggyMethod) {
        expect(() => buggyMethod()).toThrow('Extension execution failed');
      }
    });
  });
});