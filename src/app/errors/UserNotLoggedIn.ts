export class UserNotLoggedIn extends Error {
    constructor(message: string = "You are not logged in. Please log in to access this resource.") {
        super(message);
        this.name = "UserNotLoggedIn";
    }
}