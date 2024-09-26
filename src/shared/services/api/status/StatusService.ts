import { Environment } from "../../../environment";
import { Api, setAuthToken } from "../axios-config";

export interface IListagemStatus {
    id: number;
    nome: string;
}

export interface IDetalheStatus {
    id: number;
    nome: string;
}

type TStatusComTotalCount = {
    data: IListagemStatus[];
    totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<TStatusComTotalCount | Error> => {
    try {
        const urlRelativa = `/status?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;

        const accessToken = localStorage.getItem('APP_ACCESS_TOKEN');   
        if (accessToken) {
            setAuthToken(JSON.parse(accessToken));
        } else {
            setAuthToken(null);
        }

        const { data } = await Api.get(urlRelativa);
        
        if (data) {
            return {
                data,
                totalCount: Number(data.length || 0)
            }
        }

        return new Error('Erro ao listar os registros.');
        
    } catch (error) {
        console.error();
        return new Error((error as {message: string}).message || 'Erro ao listar os registros.');
    }
 };

const getById = async (id: number): Promise<IDetalheStatus | Error> => {
    try {
        const { data } = await Api.get(`/status/${id}`);

        if (data) {
            return data;            
        }

        return new Error('Erro ao consultar o registro.');
        
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao listar os registros.");
    }
 };

const create = async (dados: Omit<IDetalheStatus, 'id'>): Promise<number | Error> => { 
    try {
        const { data } = await Api.post<IDetalheStatus>(`/status`, dados);

        if (data) {
            return data.id;            
        }

        return new Error('Erro ao consultar o registro.');
        
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao criar os registros.");
    }
};

const updateById = async (id: number, dados: IDetalheStatus): Promise<void | Error> => { 
    try {
        await Api.put(`/status/${id}`, dados);
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao atualizar os registros.");
    }
};

const deleteById = async (id: number): Promise<void | Error> => { 
    try {
        await Api.delete(`/status/${id}`);
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao deletar os registros.");
    }
};

export const StatusService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById
};