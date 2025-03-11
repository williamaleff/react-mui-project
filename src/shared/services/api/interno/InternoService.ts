import { Environment } from "../../../environment";
import { Api, setAuthToken } from "../axios-config";

export interface IListagemInterno {
    id: number;
    nome: string;
    prontuario: string;
    digital: string;
    foto: string;
    funcao: string;
    localizacao: string;
    mae: string;
    regime: string;
    unidade: string;
}

export interface IDetalheInterno {
    id: number;
    nome: string;
    mae: string;
    localizacao: string;
    regime: string;
    funcao: string;
    prontuario: string;
    unidade: string;
    digital: string;
    foto: string;
}

type TInternoComTotalCount = {
    data: IListagemInterno[];
    totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<TInternoComTotalCount | Error> => {
    try {
        const urlRelativa = `/interno?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;

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

const getById = async (id: number): Promise<IDetalheInterno | Error> => {
    try {
        const accessTokenData = localStorage.getItem('APP_ACCESS_TOKEN');   
        if (accessTokenData) {
            const parsedData = JSON.parse(accessTokenData);
            setAuthToken(parsedData.token);   
        } else {
            setAuthToken(null);
        }
        const { data } = await Api.get(`/interno/${id}`);

        if (data) {
            return data;            
        }

        return new Error('Erro ao consultar o registro.');
        
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao listar os registros.");
    }
 };

const create = async (dados: Omit<IDetalheInterno, 'id'>): Promise<number | Error> => { 
    try {
        const accessTokenData = localStorage.getItem('APP_ACCESS_TOKEN');   
        if (accessTokenData) {
            const parsedData = JSON.parse(accessTokenData);
            setAuthToken(parsedData.token);   
        } else {
            setAuthToken(null);
        }
        const { data } = await Api.post<IDetalheInterno>(`/interno`, dados);

        if (data) {
            return data.id;            
        }

        return new Error('Erro ao consultar o registro.');
        
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao criar os registros.");
    }
};

const updateById = async (id: number, dados: IDetalheInterno): Promise<void | Error> => { 
    try {
        const accessTokenData = localStorage.getItem('APP_ACCESS_TOKEN');   
        if (accessTokenData) {
            const parsedData = JSON.parse(accessTokenData);
            setAuthToken(parsedData.token);   
        } else {
            setAuthToken(null);
        }
        await Api.put(`/interno/${id}`, dados);
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao atualizar os registros.");
    }
};

const deleteById = async (id: number): Promise<void | Error> => { 
    try {
        const accessTokenData = localStorage.getItem('APP_ACCESS_TOKEN');   
        if (accessTokenData) {
            const parsedData = JSON.parse(accessTokenData);
            setAuthToken(parsedData.token);   
        } else {
            setAuthToken(null);
        }
        await Api.delete(`/interno/${id}`);
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao deletar os registros.");
    }
};

export const InternoService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById
};