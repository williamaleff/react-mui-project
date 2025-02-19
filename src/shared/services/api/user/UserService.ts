import { Environment } from "../../../environment";
import { Api, setAuthToken } from "../axios-config";

export interface IListagemUser {
    id: string;
        login: string;
        password: string;
        role: 'ADMIN' | 'USER';
}

export interface IDetalheUser {
        id: string;
        login: string;
        password: string;
        role: 'ADMIN' | 'USER';
}

type TUserComTotalCount = {
    data: IListagemUser[];
    totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<TUserComTotalCount | Error> => {
    try {
        const urlRelativa = `/user?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;

        const accessTokenData = localStorage.getItem('APP_ACCESS_TOKEN');   
        if (accessTokenData) {
            const parsedData = JSON.parse(accessTokenData);
            setAuthToken(parsedData.token);   
        } else {
            setAuthToken(null);
        }
        
        const { data, headers } = await Api.get(urlRelativa);

        if (data) {
            return {
                data,
                totalCount: Number(headers['x-total-count'] || Environment.LIMITE_DE_LINHAS)
            }
        }

        return new Error('Erro ao listar os registros.');
        
    } catch (error) {
        console.error();
        return new Error((error as {message: string}).message || 'Erro ao listar os registros.');
    }
 };

const getById = async (id: string): Promise<IDetalheUser | Error> => {
    try {
        const { data } = await Api.get(`/user/${id}`);

        if (data) {
            return data;            
        }

        return new Error('Erro ao consultar o registro.');
        
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao listar os registros.");
    }
 };

const create = async (dados: Omit<IDetalheUser, 'id'>): Promise<string | Error> => { 
    try {
        const { data } = await Api.post<IDetalheUser>(`/auth/register`, dados);

        if (data) {
            return data.id;            
        }

        return new Error('Erro ao criar o acesso');
        
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao criar os registros.");
    }
};

const updateById = async (id: string, dados: IDetalheUser): Promise<void | Error> => { 
    try {
        await Api.put(`/user/${id}`, dados);
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao atualizar os registros.");
    }
};

const deleteById = async (id: string): Promise<void | Error> => { 
    try {
        await Api.delete(`/user/${id}`);
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao deletar os registros.");
    }
};

export const UserService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById
};