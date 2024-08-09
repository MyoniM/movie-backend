import prisma from '../db/db';
import { compare } from 'bcryptjs';
import { hashPassword } from '../utils/auth';
import { Prisma } from '@prisma/client';

class AuthService {
  constructor() {}

  async getUserById(id: string, select: Prisma.UserSelect | undefined): Promise<any> {
    return prisma?.user.findUnique({
      where: {
        id,
      },
      select: select,
    });
  }

  async createUser({ email, password }: { email: string; password: string }) {
    return prisma?.user.create({
      data: {
        email,
        password: await hashPassword(password), // Hash the password before saving
      },
    });
  }

  async getUserByEmail(email: string) {
    return prisma?.user.findFirst({
      where: {
        email,
      },
    });
  }

  async updateUser(
    id: string,
    {
      email,
    }: {
      email: string;
    }
  ) {
    return prisma?.user.update({
      where: {
        id: id,
      },
      data: {
        email,
      },
    });
  }

  async comparePassword(password: string, hash: string) {
    return compare(password, hash);
  }

  async changePassword({ id, password }: { id: string; password: string }) {
    await prisma?.user.update({
      where: {
        id: id,
      },
      data: {
        password: await hashPassword(password),
      },
    });
  }
}

const createAuthService = () => {
  return new AuthService();
};
export type { AuthService };
export default createAuthService;
