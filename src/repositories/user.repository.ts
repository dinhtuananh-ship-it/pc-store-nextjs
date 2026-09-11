import { prisma } from "@/lib/prisma";

export class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
  }

  async findCustomerRole() {
    return prisma.role.findUnique({
      where: {
        name: "Customer",
      },
    });
  }

  async create(data: {
    fullName: string;
    email: string;
    password: string;
    roleId: string;
    
  }) {
    return prisma.user.create({
      data,
    });
  }

  async updateLastLogin(id: string) {
    return prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }

  async findAll() {
    return prisma.user.findMany({
      include: { role: true },
      orderBy: { createdAt: "desc" },
    });
  }
}