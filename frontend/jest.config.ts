
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        resolveJsonModule: true,
        esModuleInterop: true,
      },
    }],
  },
};
