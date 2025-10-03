import axios from "axios";
import config from "../config";
import Cookies from "js-cookie";

const API_URL = config.BACKEND_URL;

export async function SignInFunction(user) {
    try{
        const res = await axios.post(`${API_URL}/api/auth/signin`, {
            email: user.email,
            password: user.password
        });
        // Set token in cookies
        Cookies.set("token", res.data.token);
        return res.data;
    }catch{
        return {
            status : "failed",
            message : "Invalid credentials"
        };
    }
}

export async function SignUpFunction(user) {
    try{
        const res = await axios.post(`${API_URL}/api/auth/signup`, {
            name : user.name,
            email: user.email,
            password: user.password
        });
        // Set token in cookies
        Cookies.set("token", res.data.token);
        return res.data;
    }catch(error){
        console.log(error)
        return {
            status : "failed",
            message : "Invalid credentials"
        };
    }
}

export async function AuthAdminLoginFunction(admin) {
    try{
        const res = await axios.post(`${API_URL}/admin/auth`,{
            username : admin.username,
            password : admin.password
        }) 
        
        Cookies.set("AdminToken", res.data.token);
        return {
            status : res.data.status,
            message : res.data.message,
        }
    }catch{
        return {
            status : "failed",
            message : "something went wrong",
        }
    }
}