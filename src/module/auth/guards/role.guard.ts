import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from '../entities/role.entity';
import { PERMISSIONS_KEY, ROLES_KEY } from '../decorator/role.decorator';
import { Permission } from '../entities/permission.entity';
import { permission } from 'process';





@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);

    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getClass(), context.getHandler()],
    );

    // If no roles or permissions are required, allow access
    if (!requiredRoles && !requiredPermissions) return true;

    const { user } = context.switchToHttp().getRequest();

    console.log('User:', user);
    console.log('Required Roles:', requiredRoles);
    console.log('Required Permissions:', requiredPermissions);


   // Check if the user has the required role
    const hasRequiredRole = requiredRoles.some(role => user.roles.includes(role));

    // Check if the role grants the required permissions
    const hasRequiredPermissions = requiredRoles.some(role => {
      const rolePermissions = user.rolePermissions[role] || [];
      return requiredPermissions.every(permission => rolePermissions.includes(permission));
    });

    // If the user has the required role and permissions, allow access
    if (hasRequiredRole && hasRequiredPermissions) {
      return true;
    } else {
      throw new ForbiddenException('Access Denied: Insufficient role or permissions');
    }
  }
}
