import config from "@/config/config";

export class AuthService {

    async sendOtp(email: string) {
        try {
            const response = await fetch(`${config.LOCAL_API_URL}/api/v1/user/send-otp`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email})
            });

            const data = await response.json();

            if(!response.ok) {
                throw new Error(data.message || 'Error while sending OTP.');
            } else {
                return true;
            }   

        } catch (error) {
            console.log('Error while sending OTP.');
            throw error;
        }
    }

    async createAccount({fullName, email, otp, dob}: {fullName: string, email: string, otp: string, dob: string}) {
        try {
            const response = await fetch(`${config.LOCAL_API_URL}/api/v1/user/signup`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({fullName, email, otp, dob})
            });

            const data = await response.json();

            if(!response.ok) {
                throw new Error(data.message || 'Error while creating Account.');
            } else {
                const userData = await this.login({email, otp});
                if(userData) return userData;
            }   

        } catch (error) {
            console.log('Error while signing up.');
            throw error;
        }
    }
      
    async login({email, otp}: {email: string, otp: string}) {
        try {
            const response = await fetch(`${config.LOCAL_API_URL}/api/v1/user/signin`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, otp})
            });

            const data = await response.json();

            if(!response.ok) {
                throw new Error(data.message || 'Invalid email or OTP.');
            } else {
                return data.data.user;
            }   

        } catch(error) {
            console.log('Error while logging in.');
            throw error;  
        }
    }

    async logout() {
        try {
            const response = await fetch(`${config.LOCAL_API_URL}/api/v1/user/signout`, {
                method: 'POST',
                credentials: 'include'
            });

            const data = await response.json();

            if(!response.ok) {
                throw new Error(data.message || 'Error while logging out');
            } else {
                return true;
            }
        } catch (error) {
            console.log('Error while logging out.'); 
            throw error;
        }
    }
}

const authService = new AuthService();
export default authService;