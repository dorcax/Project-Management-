import { Permission } from '@prisma/client';
// import { Permission } from "./permission.entity";

export enum Role {
  ADMIN = 'ADMIN',
  OWNER = 'OWNER',
  MEMBER = 'MEMBER',
  VIEWER = 'VIEWER',
}

export const ownerDefaultPermissions: Permission[] = [
  Permission.ADD_MEMBER,
  Permission.CHANGE_MEMBER_ROLE,
  Permission.REMOVE_MEMBER,
  Permission.CREATE_WORKSPACE,
  Permission.EDIT_WORKSPACE,
  Permission.DELETE_WORKSPACE,
  Permission.MANAGE_WORKSPACE_SETTINGS,
  Permission.CREATE_PROJECT,
  Permission.EDIT_PROJECT,
  Permission.DELETE_PROJECT,
  Permission.CREATE_TASK,
  Permission.EDIT_TASK,
  Permission.DELETE_TASK,
];
