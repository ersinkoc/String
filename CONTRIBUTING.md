# Contributing to @oxog/string

Thank you for your interest in contributing to @oxog/string! This document provides guidelines and instructions for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Plugin Development](#plugin-development)
- [Performance Guidelines](#performance-guidelines)

## Code of Conduct

This project follows a Code of Conduct that all contributors are expected to adhere to. Please be respectful and constructive in all interactions.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/ersinkoc/string.git
   cd string
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Run tests** to ensure everything works:
   ```bash
   npm test
   ```

## Development Setup

### Requirements

- Node.js 14 or higher
- npm 6 or higher
- TypeScript knowledge for core contributions

### Project Structure

```
src/
├── core/           # Core functionality modules
├── plugins/        # Plugin system and built-in plugins
├── utils/          # Utility functions
├── types/          # TypeScript type definitions
└── index.ts        # Main entry point

tests/
├── unit/           # Unit tests
└── benchmarks/     # Performance benchmarks

examples/           # Usage examples
docs/              # Documentation
```

### Available Scripts

```bash
npm run build          # Build all formats (CJS, ESM, types)
npm run test           # Run test suite
npm run test:coverage  # Run tests with coverage report
npm run test:watch     # Run tests in watch mode
npm run typecheck      # TypeScript type checking
npm run lint           # Lint code
npm run lint:fix       # Fix linting issues
```

## Making Changes

### Branch Naming

Use descriptive branch names:
- `feature/add-new-function`
- `fix/unicode-handling`
- `docs/update-readme`
- `perf/optimize-algorithm`

### Coding Standards

1. **TypeScript**: Use strict TypeScript with proper typing
2. **No Dependencies**: Maintain zero runtime dependencies
3. **Pure Functions**: Prefer pure functions without side effects
4. **Unicode Support**: Ensure proper Unicode/emoji handling
5. **Performance**: Consider performance implications
6. **Documentation**: Include JSDoc comments for public APIs

### Code Style

- Use TypeScript strict mode
- Follow existing code formatting
- Use meaningful variable and function names
- Keep functions focused and single-purpose
- Handle edge cases (empty strings, null, undefined)

### Adding New Functions

1. **Create the function** in the appropriate core module
2. **Add TypeScript types** in `src/types/index.ts`
3. **Export from main index** in `src/index.ts`
4. **Add to static class** in the Str class
5. **Add to chainable API** if applicable
6. **Write comprehensive tests**
7. **Update documentation**

Example function structure:
```typescript
/**
 * Brief description of what the function does
 * @param str - The input string
 * @param options - Optional configuration
 * @returns The processed string
 * @example
 * ```typescript
 * myFunction('hello world', { option: true })
 * // 'Hello World'
 * ```
 */
export function myFunction(str: string, options: MyOptions = {}): string {
  // Input validation
  if (!str || typeof str !== 'string') return '';
  
  // Implementation
  // ...
  
  return result;
}
```

## Testing

### Test Requirements

- **100% coverage**: All new code must be tested
- **Edge cases**: Test empty strings, Unicode, edge cases
- **Type safety**: Ensure TypeScript types are correct
- **Cross-platform**: Tests should pass on all supported platforms

### Writing Tests

1. Create test file in `tests/unit/`
2. Follow existing test patterns
3. Test normal cases, edge cases, and error conditions
4. Use descriptive test names

Example test structure:
```typescript
describe('myFunction', () => {
  it('should handle normal input', () => {
    expect(myFunction('hello')).toBe('expected');
  });

  it('should handle empty string', () => {
    expect(myFunction('')).toBe('');
  });

  it('should handle Unicode characters', () => {
    expect(myFunction('🚀🌍')).toBe('expected');
  });

  it('should handle null/undefined gracefully', () => {
    expect(myFunction(null as any)).toBe('');
    expect(myFunction(undefined as any)).toBe('');
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- validation.test.ts

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

## Submitting Changes

### Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new functionality
3. **Run the full test suite**: `npm test`
4. **Check TypeScript**: `npm run typecheck`
5. **Lint your code**: `npm run lint`
6. **Build the package**: `npm run build`
7. **Create a pull request** with:
   - Clear description of changes
   - Reference to any related issues
   - Screenshots/examples if applicable

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added tests for new functionality
- [ ] Coverage remains at 100%

## Documentation
- [ ] Updated README if needed
- [ ] Added JSDoc comments
- [ ] Updated TypeScript types
```

## Plugin Development

### Creating a Plugin

```typescript
import { createPlugin } from '@oxog/string';

const myPlugin = createPlugin('my-plugin', '1.0.0', (core) => {
  core.extend('myMethod', (str: string) => {
    return str.toUpperCase();
  });
});

// Usage
core.use(myPlugin);
```

### Plugin Guidelines

1. **Single responsibility**: One plugin, one purpose
2. **No side effects**: Don't modify global state
3. **Type safety**: Provide TypeScript definitions
4. **Documentation**: Include usage examples
5. **Testing**: Test plugin functionality

## Performance Guidelines

### Optimization Tips

1. **Avoid regex when possible**: Use string methods for simple operations
2. **Handle Unicode properly**: Use `[...str]` for character iteration
3. **Minimize allocations**: Reuse arrays/objects when possible
4. **Consider algorithm complexity**: Use efficient algorithms for large strings
5. **Profile performance**: Use Node.js profiling tools

### Benchmarking

```bash
npm run benchmark
```

### Performance Testing

Include performance tests for computationally expensive functions:

```typescript
describe('myFunction performance', () => {
  it('should handle large strings efficiently', () => {
    const largeString = 'a'.repeat(10000);
    const start = performance.now();
    myFunction(largeString);
    const end = performance.now();
    expect(end - start).toBeLessThan(100); // Should complete in <100ms
  });
});
```

## Questions?

- Open an issue for bugs or feature requests
- Start a discussion for questions or ideas
- Check existing issues before creating new ones

Thank you for contributing to @oxog/string!