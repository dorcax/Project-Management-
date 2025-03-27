import { SetMetadata, applyDecorators } from '@nestjs/common';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';

// Define metadata keys
export const ROLES_KEY = 'roles';
export const PERMISSIONS_KEY = 'permissions';

// export const RolesandPermissions=(roles:Role[],permissions:Permission[])=>SetMetadata(ROLES_KEY,roles) && SetMetadata(PERMISSIONS_KEY,permissions)

// applyDecorators allows combining multiple decorators in a clean way.

// SetMetadata("roles", roles) and SetMetadata("permissions", permissions) are applied together.

export const RolesandPermissions = (roles: Role[], permissions: Permission[]) =>
  applyDecorators(
    SetMetadata('roles', roles),
    SetMetadata('permissions', permissions),
  );
