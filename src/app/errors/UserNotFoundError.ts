export class UserNotFoundError extends Error {
    constructor(message: string = "User was not found") {
        super(message);
        this.name = "UserNotFoundError";
    }
}