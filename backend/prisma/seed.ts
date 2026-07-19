import { env } from "../src/config/env.config";
import { Permissions } from "../src/constants/permissions";
import { prisma } from "../src/lib/prisma";
import { hashPassword } from "../src/utils/auth/password";
async function main() {
  const permissions = [
    Permissions.MANAGE_USERS,
    Permissions.MANAGE_ROLES,
    Permissions.DELETE_POSTS,
    Permissions.VIEW_ANALYTICS,
  ];
  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: {
        name: permission,
      },
      update: {},
      create: {
        name: permission,
      },
    });
  }
  // admin role
  const adminRole = await prisma.role.upsert({
    where: {
      name: "ADMIN",
    },
    update: {
      isSystem: true,
    },
    create: {
      name: "ADMIN",
    },
  });
  // assign permissions to admin
  const dbPermissions = await prisma.permission.findMany();
  for (const permision of dbPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permision.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permision.id,
      },
    });
  }
  // create the initial admin
  const existingAdmin = await prisma.user.findUnique({
    where: {
      email: env.ADMIN_EMAIL,
    },
  });
  let adminUser;
  if (!existingAdmin) {
    const hashedPassword = await hashPassword(env.ADMIN_PASSWORD);
    adminUser = await prisma.user.create({
      data: {
        email: env.ADMIN_EMAIL,
        password: hashedPassword,
      },
    });
    console.log("admin user create successfullys");
  } else {
    adminUser = existingAdmin;
    console.log("Admin user already exists");
  }
  // assign admin role to user
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: { userId: adminUser.id, roleId: adminRole.id },
  });
  console.log("admin role assigned successfully");
  console.log("seed  compeleted successfully");
}
main()
  .catch(console.error)
  .finally(async () => await prisma.$disconnect());
