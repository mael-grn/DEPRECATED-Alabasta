import {InsertableUser, User} from "@/app/models/user";
import axios from 'axios';
import ServiceResponse from "@/app/models/serviceResponse";
import {getErrorMessageFromStatus} from "@/app/utils/stringUtil";

export class UserService {
    static async createUser(user: InsertableUser): Promise<ServiceResponse<null>> {
        const response = await axios.post('/api/user', user);
        if (response.status === 200) {
            return {
                success: true
            };
        } else {
            return {
                success: false,
                error: getErrorMessageFromStatus(response.status)
            };
        }
    }

    static async searchUser(query: string): Promise<ServiceResponse<User[]>> {
        const response = await axios.get('/api/user?q=' + query, {withCredentials: true});
        if (response.status === 200) {
            return {
                success: true,
                data: response.data as User[]
            };
        } else {
            return {
                success: false,
                error: getErrorMessageFromStatus(response.status)
            };
        }
    }

    static async getAllUsers(): Promise<ServiceResponse<User[]>> {
        const response = await axios.get('/api/user', {withCredentials: true});
        if (response.status === 200) {
            return {
                success: true,
                data: response.data as User[]
            };
        } else {
            return {
                success: false,
                error: getErrorMessageFromStatus(response.status)
            };
        }
    }

    static async getUserFromId(id: number): Promise<ServiceResponse<User>> {
        const response = await axios.get('/api/user/' + id, {withCredentials: true});
        if (response.status === 200) {
            return {
                success: true,
                data: response.data as User
            };
        } else {
            return {
                success: false,
                error: getErrorMessageFromStatus(response.status)
            };
        }
    }

    static async editUserData(editedUser: User): Promise<ServiceResponse<null>> {
        const response = await axios.put('/api/user/' + editedUser.id, editedUser, {withCredentials: true});
        if (response.status === 200) {
            return {
                success: true,
            };
        } else {
            return {
                success: false,
                error: getErrorMessageFromStatus(response.status)
            };
        }
    }

    static async deleteUser(userId: number): Promise<ServiceResponse<null>> {
        const response = await axios.delete('/api/user/' + userId, {withCredentials: true});
        if (response.status === 200) {
            return {
                success: true,
            };
        } else {
            return {
                success: false,
                error: getErrorMessageFromStatus(response.status)
            };
        }
    }
}
