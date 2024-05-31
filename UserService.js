import UserRepository from "./UserRepository.js";

 
class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

     async validateUser(username, password) {
        try {
            var result = await this.userRepository.GetUserByNameAndPassword(username, password);
            return result;
        } catch (err) {
            console.error('Error validating user', err);
        } 
    }
 
    // Diğer metodları buraya ekleyin...
}

export default UserService;