import ErrorType from "@/app/enum/ErrorTypeEnum";
import ServiceResponse from "@/app/models/ServiceResponse";

export default class AuthService {

    static async login(username: string, password: string) : Promise<ServiceResponse> {

        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })

        if (!response.ok) {
            if (response.status === 404) {
                return {success: false, error: ErrorType.USER_NOT_FOUND}
            } else if (response.status === 401) {
                return {success: false, error: ErrorType.WRONG_PASSWORD}
            } else if (response.status === 403) {
                return {success: false, error: ErrorType.NOT_VERIFIED}
            } else {
                return {success: false, error: ErrorType.SERVER_ERROR}
            }
        } else {
            return {success: true, error: null}
        }
    }

    static async register(username: string, firstName: string, lastName: string, password: string) : Promise<ServiceResponse> {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, firstName, lastName, password }),
        })

        if (!response.ok) {
            if (response.status === 409) {
                return {success: false, error: ErrorType.USERNAME_TAKEN}
            } else {
                return {success: false, error: ErrorType.SERVER_ERROR}
            }
        } else {
            return {success: true, error: null}
        }
    }
}