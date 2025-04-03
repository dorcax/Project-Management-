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
    // if no role or permission are required ,allow access
    if (!requiredRoles && !requiredPermissions) {
      return true;
    }

    //  get user
    const { user } = context.switchToHttp().getRequest();

    console.log('User Data:', user);
    console.log('Required Roles:', requiredRoles);
    console.log('Required Permissions:', requiredPermissions);
    // check if role is allowed
    if (
      requiredRoles &&
      !requiredRoles.some((role) => user.roles?.includes(role))
    ) {
      console.log(user.roles);
      throw new ForbiddenException('Access Denied: Insufficient role');
    }

    // check if permission is given
    if (
      requiredPermissions &&
      !requiredPermissions.some((permission) =>
        user.permissions?.includes(permission.trim()),
      
      )
    ) {
      throw new ForbiddenException('Access Denied: Insufficient permission');
    }
    return true;
  }
}
