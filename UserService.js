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

    async IsExistUser(username){
        try {
            var result = await this.userRepository.getUserById(username);
            return result;
        } catch (err) {
            console.error('Error validating user', err);
        }
    }

    async Register(firstName,lastName,email,userName,password){
        try {
            var result = await this.userRepository.Register(firstName, lastName, email, userName, password);
            if(result === 0){
                return false;
            }
            return true;
        } catch (err) {
            console.error('Error registering user :  ' + err);
            return false;
        }
    }
 
    // Diğer metodları buraya ekleyin...
}

export default UserService;