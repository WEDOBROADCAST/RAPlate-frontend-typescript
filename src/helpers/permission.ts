
export function getUserSession() {
    try {
        const user = sessionStorage.getItem("authUser");
        if (user) {
            return JSON.parse(user);
        }
    } catch (error) {
        // Handle any potential errors here
    }
    return null;
}


export function $can(perm: string) {
    const user = getUserSession();

    const hasPermission = user.permissions.includes(perm);

    if (user.data.roles[0].slug !== 'admin') {
        if (!hasPermission && (perm !== '')) {
            return false
        }
    }
    return true
}