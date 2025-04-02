export declare enum Role {
    ADMIN = "admin",
    TUTOR = "tutor",
    STUDENT = "student"
}
export declare const Is_Paid: {
    YES: boolean;
    NO: boolean;
};
export declare const Is_Approved: {
    YES: boolean;
    NO: boolean;
};
export declare const Is_Free_To_Watch: {
    YES: boolean;
    NO: boolean;
};
export declare const ResponseMessage: (message: string) => import("@nestjs/common").CustomDecorator<string>;
export declare const localStoragePath: string;
