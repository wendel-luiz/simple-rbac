import {
  type Generated,
  type Insertable,
  type Selectable,
  type Updateable,
} from 'kysely'

export interface Database {
  tenant: TenantTable
  user: UserTable
  userRole: UserRoleTable
  role: RoleTable
  resource: ResourceTable
  Action: ActionTable
  Permission: PermissionTable
}

export interface TenantTable {
  id: Generated<number>
  code: Generated<string>
  name: string
  description: string
  createdAt: Generated<string>
  updatedAt: Generated<string>
}

export type Tenant = Selectable<TenantTable>
export type NewTenant = Insertable<TenantTable>
export type TenantUpdate = Updateable<TenantTable>

export interface UserTable {
  id: Generated<number>
  code: Generated<string>
  tenantId: string
  name: string
  email: string
  password: string
  createdAt: Generated<string>
  updatedAt: Generated<string>
}

export type User = Selectable<UserTable>
export type NewUser = Insertable<UserTable>
export type UserUpdate = Updateable<UserTable>

export interface RoleTable {
  id: Generated<number>
  name: string
  description: string
  createdAt: Generated<string>
  updatedAt: Generated<string>
}

export type Role = Selectable<RoleTable>
export type NewRoleTable = Insertable<RoleTable>
export type RoleTableUpdate = Updateable<RoleTable>

export interface ResourceTable {
  id: Generated<number>
  name: string
  description: string
  createdAt: Generated<string>
  updatedAt: Generated<string>
}

export type Resource = Selectable<ResourceTable>
export type NewResource = Insertable<ResourceTable>
export type ResourceUpdate = Updateable<ResourceTable>

export interface ActionTable {
  id: Generated<number>
  name: string
  createdAt: Generated<string>
  updatedAt: Generated<string>
}

export type Action = Selectable<ActionTable>
export type NewAction = Insertable<ActionTable>
export type ActionUpdate = Updateable<ActionTable>

export interface PermissionTable {
  id: Generated<number>
  roleId: number
  actionId: number
  resourceId: number
  createdAt: Generated<string>
}

export type Permission = Selectable<PermissionTable>
export type NewPermission = Insertable<PermissionTable>
export type PermissionUpdate = Updateable<PermissionTable>

export interface UserRoleTable {
  id: Generated<number>
  userId: number
  roleId: number
  createdAt: Generated<string>
}

export type UserRole = Selectable<UserRoleTable>
export type NewUserRole = Insertable<UserRoleTable>
export type UserRoleUpdate = Updateable<UserRoleTable>
