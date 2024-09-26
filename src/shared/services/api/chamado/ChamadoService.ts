import { Environment } from "../../../environment";
import { Api, setAuthToken } from "../axios-config";

export interface IListagemChamado {
    id: number;
    tipoId: number;
    descricao: string;
    pessoaId: number;
    horario: string;
    data: string;
    chamadoGlpi: string;

}

export interface IDetalheChamado {
    id: number;
    tipoId: number;
    descricao: string;
    pessoaId: number;
    horario: string;
    data: string;
    chamadoGlpi: string;

}

type TChamadoComTotalCount = {
    data: IListagemChamado[];
    totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<TChamadoComTotalCount | Error> => {
    try {
        const urlRelativa = `/chamado?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&descricao_like=${filter}`;

        const accessToken = localStorage.getItem('APP_ACCESS_TOKEN');   
        if (accessToken) {
            setAuthToken(JSON.parse(accessToken));
        } else {
            setAuthToken(null);
        }

        const { data} = await Api.get(urlRelativa);
    
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

 const getDate = async (page = 1, filter = ''): Promise<TChamadoComTotalCount | Error> => {
    try {
        const urlRelativa = `/chamado?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&data_like=${filter}`;

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


const getById = async (id: number): Promise<IDetalheChamado | Error> => {
    try {
        const { data } = await Api.get(`/chamado/${id}`);

        if (data) {
            return data;            
        }

        return new Error('Erro ao consultar o registro.');
        
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao listar os registros.");
    }
 };

const create = async (dados: Omit<IDetalheChamado, 'id'>): Promise<number | Error> => { 
    try {
        const { data } = await Api.post<IDetalheChamado>(`/chamado`, dados);

        if (data) {
            return data.id;            
        }

        return new Error('Erro ao consultar o registro.');
        
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao criar os registros.");
    }
};

const updateById = async (id: number, dados: IDetalheChamado): Promise<void | Error> => { 
    try {
        await Api.put(`/chamado/${id}`, dados);
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao atualizar os registros.");
    }
};

const deleteById = async (id: number): Promise<void | Error> => { 
    try {
        await Api.delete(`/chamado/${id}`);
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao deletar os registros.");
    }
};

export const ChamadoService = {
    getAll,
    getDate,
    getById,
    create,
    updateById,
    deleteById
};