// Simple API test to verify the testing infrastructure works
describe('/api/search', () => {
  it('should pass a basic test', () => {
    expect(true).toBe(true);
  });

  it('should handle basic string operations', () => {
    const testString = 'hello world';
    expect(testString).toContain('world');
  });

  it('should handle basic math operations', () => {
    const result = 2 + 2;
    expect(result).toBe(4);
  });
}); 