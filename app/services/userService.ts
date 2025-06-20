import {InsertableUser, User} from "@/app/models/user";
import axios, {AxiosError} from 'axios';
import ServiceResponse from "@/app/models/serviceResponse";
import {getErrorMessageFromStatus} from "@/app/utils/stringUtil";

export class UserService {
    static async createUser(user: InsertableUser): Promise<ServiceResponse<null>> {
        try {
            await axios.post('/api/user', user);
            return {
                success: true
            };
        } catch (e) {
            return {
                success: false,
                error: getErrorMessageFromStatus((e as AxiosError).status || -1)
            };
        }
    }

    static async searchUser(query: string): Promise<ServiceResponse<User[]>> {
        try {
            const response = await axios.get('/api/user?q=' + query, {withCredentials: true});
            return {
                success: true,
                data: response.data as User[]
            };
        } catch (e) {
            return {
                success: false,
                error: getErrorMessageFromStatus((e as AxiosError).status || -1)
            };
        }
    }

    static async getAllUsers(): Promise<ServiceResponse<User[]>> {
        try {
            const response = await axios.get('/api/user', {withCredentials: true});
            return {
                success: true,
                data: response.data as User[]
            };
        } catch (e) {
            return {
                success: false,
                error: getErrorMessageFromStatus((e as AxiosError).status || -1)
            };
        }
    }

    static async getUserFromId(id: number): Promise<ServiceResponse<User>> {
        try {
            const response = await axios.get('/api/user/' + id, {withCredentials: true});
            return {
                success: true,
                data: response.data as User
            };
        } catch (e) {
            return {
                success: false,
                error: getErrorMessageFromStatus((e as AxiosError).status || -1)
            };
        }
    }

    static async editUserData(editedUser: User): Promise<ServiceResponse<null>> {
        try {
            await axios.put('/api/user/' + editedUser.id, editedUser, {withCredentials: true});
            return {
                success: true,
            };
        } catch (e) {
            return {
                success: false,
                error: getErrorMessageFromStatus((e as AxiosError).status || -1)
            };
        }
    }

    static async deleteUser(userId: number): Promise<ServiceResponse<null>> {
        try {
            await axios.delete('/api/user/' + userId, {withCredentials: true});
            return {
                success: true,
            };
        } catch (e) {
            return {
                success: false,
                error: getErrorMessageFromStatus((e as AxiosError).status || -1)
            };
        }
    }
}
