import { Prisma } from "../../../generated/prisma/index.js";

export type allRoleType = Prisma.RoleGetPayload<{
  select: {
    id: true;
    name: true;
    createdAt: true;
    userRoles: {
      select: {
        userId: true;
      };
    };
    rolePermissions: {
      select: {
        permission: {
          select: {
            id: true;
            name: true;
          };
        };
      };
    };
  };
}>[];

export type GetRoleByIdType = Prisma.RoleGetPayload<{
  select: {
    id: true;
    name: true;
    isSystem: true;
    createdAt: true;
    rolePermissions: {
      select: {
        assignedAt: true;
        permission: {
          select: {
            id: true;
            name: true;
          };
        };
      };
    };
    userRoles: {
      select: {
        assignedAt: true;
        user: {
          select: {
            id: true;
            email: true;
            createdAt: true;
          };
        };
      };
    };
  };
}>;

export type updateRoleInputType = {
  name?: string;
  permissions?: string[];
};

export type GetAllUserByRoleId = Prisma.UserRoleGetPayload<{
  where: {
    roleId: string;
  };
  include: {
    user: true;
  };
}>;

export type GetUserPermission = Prisma.UserGetPayload<{
  where: {
    id: true;
  };
  include: {
    userRole: {
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true;
              };
            };
          };
        };
      };
    };
  };
}>;

export type getAllPermissionsType = Prisma.PermissionGetPayload<{
  select: {
    id: true;
    name: true;
  };
}>;

export type getPermissionDetailType = Prisma.PermissionGetPayload<{
  where: {
    id: true;
  };
  include: {
    rolePermissions: {
      include: {
        role: {
          select: {
            id: true;
            name: true;
          };
        };
      };
    };
  };
}>;

export type GetUserByPermissionsType = Prisma.PermissionGetPayload<{
  where: {
    id: true;
  };
  select: {
    id: true;
    name: true;
    rolePermissions: {
      select: {
        role: {
          select: {
            userRoles: {
              select: {
                user: {
                  select: {
                    id: true;
                    email: true;
                  };
                };
              };
            };
          };
        };
      };
    };
  };
}>;
