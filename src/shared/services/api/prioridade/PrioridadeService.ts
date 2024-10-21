import { Environment } from "../../../environment";
import { Api, setAuthToken } from "../axios-config";

export interface IListagemPrioridade {
    id: number;
    nome: string;
}

export interface IDetalhePrioridade {
    id: number;
    nome: string;
}

type TPrioridadeComTotalCount = {
    data: IListagemPrioridade[];
    totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<TPrioridadeComTotalCount | Error> => {
    try {
        const urlRelativa = `/prioridade?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;

        const accessToken = localStorage.getItem('APP_ACCESS_TOKEN');   
        if (accessToken) {
            setAuthToken(JSON.parse(accessToken));
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

const getById = async (id: number): Promise<IDetalhePrioridade | Error> => {
    try {
        const { data } = await Api.get(`/prioridade/${id}`);

        if (data) {
            return data;            
        }

        return new Error('Erro ao consultar o registro.');
        
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao listar os registros.");
    }
 };

const create = async (dados: Omit<IDetalhePrioridade, 'id'>): Promise<number | Error> => { 
    try {
        const { data } = await Api.post<IDetalhePrioridade>(`/prioridade`, dados);

        if (data) {
            return data.id;            
        }

        return new Error('Erro ao consultar o registro.');
        
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao criar os registros.");
    }
};

const updateById = async (id: number, dados: IDetalhePrioridade): Promise<void | Error> => { 
    try {
        await Api.put(`/prioridade/${id}`, dados);
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao atualizar os registros.");
    }
};

const deleteById = async (id: number): Promise<void | Error> => { 
    try {
        await Api.delete(`/prioridade/${id}`);
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao deletar os registros.");
    }
};

export const PrioridadeService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById
};