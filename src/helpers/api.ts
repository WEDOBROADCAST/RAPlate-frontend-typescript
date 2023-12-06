import config from "../config";
async function apiRequest(url: any, method: string, bodyData = null) {
    const obj = await getUserSession();

    const headers = {
        'Authorization': `Bearer ${obj?.token?.token}`,
        'Content-Type': 'application/json',
    };

    const options: {
        method: string;
        headers: { [key: string]: string };
        body?: string;
    } = {
        method: method,
        headers: headers,
    };

    if (bodyData) {
        options.body = JSON.stringify(bodyData);
    }

    const response = await fetch(url, options);
    return response;
}


export function getProfilePhoto(filename: string | any[] | undefined) {
    if (filename?.length && typeof filename != 'undefined') {
        return `${config.api.API_URL}/uploads/${filename}`;
    } else {
        return 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png'
    }
}



export async function changeProfilePhoto(selectedFile: string | Blob) {
    const obj = await getUserSession();

    const headers = {
        'Authorization': `Bearer ${obj?.token?.token}`,
    };
    const formData = new FormData();
    formData.append('profile_photo', selectedFile);

    const options = {
        method: 'POST',
        headers: headers,
        body: formData,
    };

    const response = await fetch(`${config.api.API_URL}/user/update-photo`, options);
    return response;
}

export async function getUserSession() {
    const user = await sessionStorage.getItem("authUser");
    if (user) {
        return JSON.parse(user);
    }
}

export async function createUser(userData?: any) {
    return await apiRequest(`${config.api.API_URL}/user/create`, 'POST', userData);
}
export async function listUser(page: any, perPage = 10, sort = {}, term = '') {
    return await apiRequest(`${config.api.API_URL}/user?page=${page}&perPage=${perPage}&sort=${sort}&search=${term}`, 'GET');
}

export async function updateUser(id: string | undefined, userData: any) {
    return await apiRequest(`${config.api.API_URL}/user/${id}/update`, 'POST', userData);
}

export async function updateUserPassword(id: any, userData: any) {
    return await apiRequest(`${config.api.API_URL}/user/${id}/update-password`, 'POST', userData);
}

export async function userDetail(id: string | undefined) {
    return await apiRequest(`${config.api.API_URL}/user/${id}/show`, 'GET');
}

export async function userDelete(id: number) {
    return await apiRequest(`${config.api.API_URL}/user/${id}/delete`, 'DELETE');
}

export async function requestResetPassword(data: any) {
    return await apiRequest(`${config.api.API_URL}/password/reset-request`, 'POST', data);
}

export async function resetPassword(data: any) {
    return await apiRequest(`${config.api.API_URL}/password/reset`, 'POST', data);
}

export async function sign(data: any) {
    return await apiRequest(`${config.api.API_URL}/auth/signin`, 'POST', data);
}

export async function enable2fa(data: any) {
    return await apiRequest(`${config.api.API_URL}/user/2fa/enable`, 'POST', data);
}
export async function verify2fa(data: any) {
    return await apiRequest(`${config.api.API_URL}/user/2fa/verify`, 'POST', data);
}

export async function disable2fa(data: any) {
    return await apiRequest(`${config.api.API_URL}/user/2fa/disable`, 'POST', data);
}


/* role */


export async function createRole(roleData: any) {
    return await apiRequest(`${config.api.API_URL}/role/create`, 'POST', roleData);
}

export async function listRole(page = 1, perPage = 10, sort = 'id,desc', term = '') {
    return await apiRequest(`${config.api.API_URL}/role?page=${page}&perPage=${perPage}&sort=${sort}&search=${term}`, 'GET');
}
export async function updateRole(id: string | undefined, roleData: any) {
    return await apiRequest(`${config.api.API_URL}/role/${id}/update`, 'POST', roleData);
}

export async function roleDetail(id: string | undefined) {
    return await apiRequest(`${config.api.API_URL}/role/${id}/show`, 'GET');
}

export async function roleDelete(id: string) {
    return await apiRequest(`${config.api.API_URL}/role/${id}/delete`, 'DELETE');
}

/* permission */

export async function createPermission(permissionData: any) {
    return await apiRequest(`${config.api.API_URL}/permission/create`, 'POST', permissionData);
}

export async function listPermission(page: any, perPage = 10, sort = {}, term = '') {
    return await apiRequest(`${config.api.API_URL}/permission?page=${page}&perPage=${perPage}&sort=${sort}&search=${term}`, 'GET');
}

export async function updatePermission(id: string | undefined, permissionData: any) {
    return await apiRequest(`${config.api.API_URL}/permission/${id}/update`, 'POST', permissionData);
}

export async function permissionDetail(id: string | undefined) {
    return await apiRequest(`${config.api.API_URL}/permission/${id}/show`, 'GET');
}

export async function permissionDelete(id: number) {
    return await apiRequest(`${config.api.API_URL}/permission/${id}/delete`, 'DELETE');
}

export async function permissionGroupping(search: any) {
    return await apiRequest(`${config.api.API_URL}/permission/groupping?search=${search}`, 'GET',);
}

export async function permissionRole(id: any) {
    return await apiRequest(`${config.api.API_URL}/permission/${id}/role`, 'GET');
}
export async function permissionRoleUpdate(id: number, data: never[] | any) {
    return await apiRequest(`${config.api.API_URL}/permission/${id}/role/update`, 'POST', data);
}

export async function auditDetail(id: string | undefined | number) {
    return await apiRequest(`${config.api.API_URL}/audit/${id}/show`, 'GET');
}

export async function listAudit(page = 1, perPage: number | React.SetStateAction<number> = 10, sort = 'id,desc', term: string | undefined = '') {
    return await apiRequest(`${config.api.API_URL}/audit?page=${page}&perPage=${perPage}&sort=${sort}&search=${term}`, 'GET');
}