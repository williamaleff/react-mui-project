import { Environment } from "../../../environment";
import { Api, setAuthToken } from "../axios-config";

export interface IListagemChamado {
    id: number;
    tipoId: number;
    descricao: string;
    statusId: number;
    prioridadeId: number;    
    dataCriacao: string;
    dataAtualizacao: string;
    dataFechamento: string;
    clienteId: number;
    agenteId: number;
    chamadoGlpi: string;
    anexo: string;
}

export interface IDetalheChamado {
    id: number;
    tipoId: number;
    descricao: string;
    statusId: number;
    prioridadeId: number;    
    dataCriacao: string;
    dataAtualizacao: string;
    dataFechamento: string;
    clienteId: number;
    agenteId: number;
    chamadoGlpi: string;
    anexo: string;

}

type TChamadoComTotalCount = {
    data: IListagemChamado[];
    totalCount: number;
}

const getAll = async (page = 0, filter = ''): Promise<TChamadoComTotalCount | Error> => {
    try {
        const urlRelativa = `/chamado?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&descricao_like=${filter}`;

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

 const getDate = async (page = 1, filter = '', filter2 = ''): Promise<TChamadoComTotalCount | Error> => {
    try {

        if(filter.length >= 16){

         filter = filter.substring(0, filter.length - 9)

            if(filter2.length > 16 ){
               filter2 = filter2.substring(0, filter2.length - 9)
            }
                
        }

        const urlRelativa = `/data?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&data_like=${filter}&data_like2=${filter2}`;

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

        return new Error('Erro ao criar o registro.');
        
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