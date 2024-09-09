import User from "../models/User.model.js";

export default class UserService {

    async getSaved(user) {
        // return "getting from controller";
        try {

            const userLoc = await User.findOne({ email: user.email });

            return userLoc.savedLocations;

        } catch (e) {
            throw new Error("Could not find locations")
        }   
    }

    async addLocation({ userRef, location }) {
        try {
            const user = await User.findOne({ email: userRef.email });
            if (!(user.savedLocations.includes(location))) {
                user.savedLocations.push(location);
                
                return user.save();
            }
            
        } catch (e) {
            throw new Error("error");
        }
    }

    async removeLocation({ userRef, location }) {
        try {

            // console.log(userRef);
            
            const user = await User.findOne({ email: userRef.email });
            if ((user.savedLocations.includes(location))) {
                user.savedLocations = user.savedLocations.filter(e => e !== location);
                return user.save();
            }
            
        } catch (e) {
            throw new Error("error");
        }
    }

    async addUser(newUser) {
        let user;
        try {
            user = new User(newUser);
        } catch (e) {
           
            throw new Error("Invalid Details");    
        }
        return await user.save();
    }

    async editUser(user) {
        try {
            const updatedUser = await User.findOneAndUpdate(
                { email: user.email },
                { password: user.password },
                { new: true }
            );

            console.log()
            if (!updatedUser) throw new Error("User not found");

            return updatedUser
        } catch (e) {
            console.log("message: ", e.message);
            throw new Error("Password was not updated")
        }
        
    }

    async login({ email, password }) {
        const user = await User.findOne({ email });

        if (user && password === user.password) {
            return user;
        }

        throw new Error();
    }    

}