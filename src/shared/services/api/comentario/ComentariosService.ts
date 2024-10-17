import { Environment } from "../../../environment";
import { Api, setAuthToken } from "../axios-config";

export interface IListagemComentarios {
    id: number;
    chamadoId: number;
    agenteId: number;
    clienteId: string;
    dataCriacao: string;
    comentario: string;
}

export interface IDetalheComentarios {
    id: number;
    chamadoId: number;
    agenteId: number;
    clienteId: string;
    dataCriacao: string;
    comentario: string;
}

type TComentariosComTotalCount = {
    data: IListagemComentarios[];
    totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<TComentariosComTotalCount | Error> => {
    try {
        const urlRelativa = `/comentarios?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&comentario_like=${filter}`;

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

const getById = async (id: number): Promise<IDetalheComentarios | Error> => {
    try {
        const { data } = await Api.get(`/comentarios/${id}`);

        if (data) {
            return data;            
        }

        return new Error('Erro ao consultar o registro.');
        
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao listar os registros.");
    }
 };

const create = async (dados: Omit<IDetalheComentarios, 'id'>): Promise<number | Error> => { 
    try {
        const { data } = await Api.post<IDetalheComentarios>(`/comentarios`, dados);

        if (data) {
            return data.id;            
        }

        return new Error('Erro ao consultar o registro.');
        
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao criar os registros.");
    }
};

const updateById = async (id: number, dados: IDetalheComentarios): Promise<void | Error> => { 
    try {
        await Api.put(`/comentarios/${id}`, dados);
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao atualizar os registros.");
    }
};

const deleteById = async (id: number): Promise<void | Error> => { 
    try {
        await Api.delete(`/comentarios/${id}`);
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao deletar os registros.");
    }
};

export const ComentariosService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById
};