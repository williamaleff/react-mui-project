import { Environment } from "../../../environment";
import { Api, setAuthToken } from "../axios-config";

export interface IListagemCliente {
    id: number;
    nome: string;
    email: string;
    funcaoId: number;
    dataCriacao: string;
    telefone: string;
    outros: string;
    nivelId: number;
    foto: string;
    anexo: string;
}

export interface IDetalheCliente {
    id: number;
    nome: string;
    email: string;
    funcaoId: number;
    dataCriacao: string;
    telefone: string;
    outros: string;
    nivelId: number;
    foto: string;
    anexo: string;
}

type TClienteComTotalCount = {
    data: IListagemCliente[];
    totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<TClienteComTotalCount | Error> => {
    try {
        const urlRelativa = `/cliente?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;

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

const getById = async (id: number): Promise<IDetalheCliente | Error> => {
    try {
        const { data } = await Api.get(`/cliente/${id}`);

        if (data) {
            return data;            
        }

        return new Error('Erro ao consultar o registro.');
        
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao listar os registros.");
    }
 };

const create = async (dados: Omit<IDetalheCliente, 'id'>): Promise<number | Error> => { 
    try {
        const { data } = await Api.post<IDetalheCliente>(`/cliente`, dados);

        if (data) {
            return data.id;            
        }

        return new Error('Erro ao consultar o registro.');
        
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao criar os registros.");
    }
};

const updateById = async (id: number, dados: IDetalheCliente): Promise<void | Error> => { 
    try {
        await Api.put(`/cliente/${id}`, dados);
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao atualizar os registros.");
    }
};

const deleteById = async (id: number): Promise<void | Error> => { 
    try {
        await Api.delete(`/cliente/${id}`);
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao deletar os registros.");
    }
};

export const ClienteService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById
};