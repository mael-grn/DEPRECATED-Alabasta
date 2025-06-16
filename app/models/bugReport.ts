import { User } from "./user";

export interface BugReport {
    id: number;
    user: User;
    details: string;
    category?: string;
    created_at: Date;
}

export interface InsertableBugReport {
    user_id: number;
    details: string;
    category?: string;
}
