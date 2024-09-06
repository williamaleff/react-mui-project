import { Environment } from "../../../environment";
import { Api } from "../axios-config";

export interface IListagemTipos {
    id: number;
    nome: string;
}

export interface IDetalheTipo {
    id: number;
    nome: string;
}

type TTiposComTotalCount = {
    data: IListagemTipos[];
    totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<TTiposComTotalCount | Error> => {
    try {
        const urlRelativa = `/tipos?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;

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

const getById = async (id: number): Promise<IDetalheTipo | Error> => {
    try {
        const { data } = await Api.get(`/tipos/${id}`);

        if (data) {
            return data;            
        }

        return new Error('Erro ao consultar o registro.');
        
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao listar os registros.");
    }
 };

const create = async (dados: Omit<IDetalheTipo, 'id'>): Promise<number | Error> => { 
    try {
        const { data } = await Api.post<IDetalheTipo>(`/tipos`, dados);

        if (data) {
            return data.id;            
        }

        return new Error('Erro ao consultar o registro.');
        
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao criar os registros.");
    }
};

const updateById = async (id: number, dados: IDetalheTipo): Promise<void | Error> => { 
    try {
        await Api.put(`/tipos/${id}`, dados);
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao atualizar os registros.");
    }
};

const deleteById = async (id: number): Promise<void | Error> => { 
    try {
        await Api.delete(`/tipos/${id}`);
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao deletar os registros.");
    }
};

export const TiposService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById
};