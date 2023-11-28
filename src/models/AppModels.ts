export interface AuditData {
    id?: string,
    name: string,
    ip: string
    event: string,
    auditable: string,
    user?: { name: string },
    url: string,
    old_data: any[string],
    new_data: any[string],
    created_at?: string,
}

interface RoleData {
    id?: string,
    name: string,
}

export interface UserData {
    id: number,
    name: string,
    email: string,
    roles: RoleData[],
    created_at?: string,
}