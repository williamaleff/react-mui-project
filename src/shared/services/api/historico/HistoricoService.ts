import { Environment } from "../../../environment";
import { Api, setAuthToken } from "../axios-config";

export interface IListagemHistorico {
    id: number;
    chamadoId: number;
    statusAnteriorId:number;
    statusNovoId: number;
    data: string;
}

export interface IDetalheHistorico {
    id: number;
    chamadoId: number;
    statusAnteriorId:number;
    statusNovoId: number;
    data: string;
}

type THistoricoComTotalCount = {
    data: IListagemHistorico[];
    totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<THistoricoComTotalCount | Error> => {
    try {
        const urlRelativa = `/historico?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&chamadoId_like=${filter}`;

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

const getById = async (id: number): Promise<IDetalheHistorico | Error> => {
    try {
        const { data } = await Api.get(`/historico/${id}`);

        if (data) {
            return data;            
        }

        return new Error('Erro ao consultar o registro.');
        
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao listar os registros.");
    }
 };

const create = async (dados: Omit<IDetalheHistorico, 'id'>): Promise<number | Error> => { 
    try {
        const { data } = await Api.post<IDetalheHistorico>(`/historico`, dados);

        if (data) {
            return data.id;            
        }

        return new Error('Erro ao consultar o registro.');
        
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao criar os registros.");
    }
};

const updateById = async (id: number, dados: IDetalheHistorico): Promise<void | Error> => { 
    try {
        await Api.put(`/historico/${id}`, dados);
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao atualizar os registros.");
    }
};

const deleteById = async (id: number): Promise<void | Error> => { 
    try {
        await Api.delete(`/historico/${id}`);
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao deletar os registros.");
    }
};

export const HistoricoService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById
};