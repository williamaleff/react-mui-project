import { Environment } from "../../../environment";
import { Api, setAuthToken } from "../axios-config";

export interface IListagemNivel {
    id: number;
    nome: string;
}

export interface IDetalheNivel {
    id: number;
    nome: string;
}

type TNivelComTotalCount = {
    data: IListagemNivel[];
    totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<TNivelComTotalCount | Error> => {
    try {
        const urlRelativa = `/nivel?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;

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

const getById = async (id: number): Promise<IDetalheNivel | Error> => {
    try {
        const { data } = await Api.get(`/nivel/${id}`);

        if (data) {
            return data;            
        }

        return new Error('Erro ao consultar o registro.');
        
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao listar os registros.");
    }
 };

const create = async (dados: Omit<IDetalheNivel, 'id'>): Promise<number | Error> => { 
    try {
        const { data } = await Api.post<IDetalheNivel>(`/nivel`, dados);

        if (data) {
            return data.id;            
        }

        return new Error('Erro ao consultar o registro.');
        
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao criar os registros.");
    }
};

const updateById = async (id: number, dados: IDetalheNivel): Promise<void | Error> => { 
    try {
        await Api.put(`/nivel/${id}`, dados);
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao atualizar os registros.");
    }
};

const deleteById = async (id: number): Promise<void | Error> => { 
    try {
        await Api.delete(`/nivel/${id}`);
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao deletar os registros.");
    }
};

export const NivelService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById
};