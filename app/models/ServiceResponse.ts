import ErrorType from "@/app/enum/ErrorTypeEnum";

export default interface ServiceResponse<T> {
    success: boolean;
    data?: T;
    error?: ErrorType;
}