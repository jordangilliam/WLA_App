/**
 * Test user accounts for automated testing
 */

export interface TestUser {
  email: string;
  password: string;
  role: 'student' | 'teacher' | 'admin';
  name: string;
  id?: string;
}

export const TEST_USERS: Record<string, TestUser> = {
  student: {
    email: 'test.student@wla.test',
    password: 'TestStudent123!',
    role: 'student',
    name: 'Test Student',
  },
  teacher: {
    email: 'test.teacher@wla.test',
    password: 'TestTeacher123!',
    role: 'teacher',
    name: 'Test Teacher',
  },
  admin: {
    email: 'test.admin@wla.test',
    password: 'TestAdmin123!',
    role: 'admin',
    name: 'Test Admin',
  },
};

export const getTestUser = (role: 'student' | 'teacher' | 'admin'): TestUser => {
  return TEST_USERS[role];
};

