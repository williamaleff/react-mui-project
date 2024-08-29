import { Environment } from "../../../environment";
import { Api } from "../axios-config";

export interface IListagemSuporte {
    id: number;
    tipoId: number;
    descricao: string;
    pessoaId: number;
    horario: string;
    data: string;
    chamadoGlpi: string;

}

export interface IDetalheSuporte {
    id: number;
    tipoId: number;
    descricao: string;
    pessoaId: number;
    horario: string;
    data: string;
    chamadoGlpi: string;

}

type TSuporteComTotalCount = {
    data: IListagemSuporte[];
    totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<TSuporteComTotalCount | Error> => {
    try {
        const urlRelativa = `/suporte?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&descricao_like=${filter}`;

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

 const getDate = async (page = 1, filter = ''): Promise<TSuporteComTotalCount | Error> => {
    try {
        const urlRelativa = `/suporte?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&data_like=${filter}`;

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


const getById = async (id: number): Promise<IDetalheSuporte | Error> => {
    try {
        const { data } = await Api.get(`/suporte/${id}`);

        if (data) {
            return data;            
        }

        return new Error('Erro ao consultar o registro.');
        
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao listar os registros.");
    }
 };

const create = async (dados: Omit<IDetalheSuporte, 'id'>): Promise<number | Error> => { 
    try {
        const { data } = await Api.post<IDetalheSuporte>(`/suporte`, dados);

        if (data) {
            return data.id;            
        }

        return new Error('Erro ao consultar o registro.');
        
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao criar os registros.");
    }
};

const updateById = async (id: number, dados: IDetalheSuporte): Promise<void | Error> => { 
    try {
        await Api.put(`/suporte/${id}`, dados);
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao atualizar os registros.");
    }
};

const deleteById = async (id: number): Promise<void | Error> => { 
    try {
        await Api.delete(`/suporte/${id}`);
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao deletar os registros.");
    }
};

export const SuporteService = {
    getAll,
    getDate,
    getById,
    create,
    updateById,
    deleteById
};