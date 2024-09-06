import { Api } from "../axios-config";

interface IAuth {
    token: string;
}

const auth = async (email: string, password2: string): Promise<IAuth | Error> => { 
    const dados = { login: email, password: password2 }
    try {
        const { data } = await Api.post<IAuth>(`/auth/login`, dados);

        if (data) {
            return data;            
        }

        return new Error('Erro no login.');
        
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro no login.");
    }
}

export const AuthService = {
    auth
};