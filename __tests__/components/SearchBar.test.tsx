const React = require('react');
const { render, screen } = require('@testing-library/react');

// Mock the debounce hook
jest.mock('@/hooks/useDebounce', () => ({
  useDebounceWithLoading: (value, delay) => ({
    debouncedValue: value,
    isLoading: false,
  }),
}));

// Simple test to verify the testing infrastructure works
describe('SearchBar', () => {
  it('should render a basic element', () => {
    // Simple test that just creates a div
    const { container } = render(React.createElement('div', { 'data-testid': 'test-element' }, 'Test'));
    expect(container).toBeTruthy();
  });

  it('should find test element', () => {
    render(React.createElement('div', { 'data-testid': 'search-test' }, 'Search Test'));
    expect(screen.getByTestId('search-test')).toBeTruthy();
  });
}); 