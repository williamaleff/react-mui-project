import { Environment } from "../../../environment";
import { Api } from "../axios-config";

export interface IListagemFuncoes {
    id: number;
    nome: string;
}

export interface IDetalheFuncoes {
    id: number;
    nome: string;
}

type TFuncoesComTotalCount = {
    data: IListagemFuncoes[];
    totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<TFuncoesComTotalCount | Error> => {
    try {
        const urlRelativa = `/funcoes?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;

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

const getById = async (id: number): Promise<IDetalheFuncoes | Error> => {
    try {
        const { data } = await Api.get(`/funcoes/${id}`);

        if (data) {
            return data;            
        }

        return new Error('Erro ao consultar o registro.');
        
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao listar os registros.");
    }
 };

const create = async (dados: Omit<IDetalheFuncoes, 'id'>): Promise<number | Error> => { 
    try {
        const { data } = await Api.post<IDetalheFuncoes>(`/funcoes`, dados);

        if (data) {
            return data.id;            
        }

        return new Error('Erro ao consultar o registro.');
        
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao criar os registros.");
    }
};

const updateById = async (id: number, dados: IDetalheFuncoes): Promise<void | Error> => { 
    try {
        await Api.put(`/funcoes/${id}`, dados);
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao atualizar os registros.");
    }
};

const deleteById = async (id: number): Promise<void | Error> => { 
    try {
        await Api.delete(`/funcoes/${id}`);
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao deletar os registros.");
    }
};

export const FuncoesService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById
};