import ErrorType from "@/app/enum/ErrorTypeEnum";

export default interface ServiceResponse {
    success: boolean;
    error: ErrorType | null;
}