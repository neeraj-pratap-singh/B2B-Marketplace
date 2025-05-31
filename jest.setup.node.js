// Setup for Node.js environment tests (API routes, database operations)

// Mock environment variables
process.env.MONGODB_URI = 'mongodb://localhost:27017/b2b-marketplace-test'
process.env.NODE_ENV = 'test'
process.env.NEXTAUTH_SECRET = 'test-secret'
process.env.NEXTAUTH_URL = 'http://localhost:3000'

// Mock console methods for cleaner test output
global.console = {
  ...console,
  // Suppress console.log in tests but keep error and warn
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
}

// Global test timeout for database operations
jest.setTimeout(30000)

// Mock Next.js headers and cookies for API testing
jest.mock('next/headers', () => ({
  headers: jest.fn(() => new Map()),
  cookies: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  })),
}))

// Mock Next.js cache functions
jest.mock('next/cache', () => ({
  revalidateTag: jest.fn(),
  revalidatePath: jest.fn(),
  unstable_cache: jest.fn((fn) => fn),
})) 