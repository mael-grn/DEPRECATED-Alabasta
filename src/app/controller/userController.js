import {getItem, removeItem, setItem} from "@/app/utils/cookiesUtils";
import User from "@/app/model/user";
import {deleteEntity, loginToken, updateEntity} from "@/app/utils/queryUtils";

/**
 * Save the user data in a secured cookie on the server
 * @returns {Promise<void>}
 */
export const saveUserData = async (user) => {
    await setItem('user', JSON.stringify(user));
}

/**
 * Recover the user data from the secured cookie on the server
 * return null if the cookie is not found
 * ATTENTION : even if the user is found and returned, it is not guaranteed that the user is authenticated.
 * To authenticate the user, you must use the authenticateUser function
 * @returns {Promise<User>}
 */
export const recoverUserData = async () => {
    let user;
    try {
        let item = await getItem('user');
        user = JSON.parse(item.toString());
    } catch (e) {
        return null;
    }
    return new User(user.name, user.surname);
}

export const authenticateUser = async () => {
    let res = await loginToken();
    return res.success;
}

/**
 * Delete the user data from the secured cookie on the server
 */
export const deleteUserData = async () => {
    await removeItem('user');
}

/**
 * Update the user data in the database
 * @param user
 * @returns {Promise<void>}
 */
export const updateUser = async (user) => {
    return await updateEntity('user', user);
}

/**
 * Delete the user data in the database
 * @param user
 * @returns {Promise<void>}
 */
export const deleteUser = async (user) => {
    return await deleteEntity ('user', user);
}
