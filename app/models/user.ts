export default interface User {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    isApproved: boolean;
    isAdmin: boolean;
    createdAt: Date;
    updatedAt: Date;
}