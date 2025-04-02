import { Api, setAuthToken } from "../axios-config";

// Interface para definir a estrutura dos dados do candidato
export interface Candidato {
  id: number;
  prontuario: string;
  nome: string;
  mae: string;
  unidade: string;
  ultimaLocalizacao: string;
  tipoDeRegime: string;
  funcao: string | null;
  dataDaAtualizacao: string; // ou Date, conforme sua necessidade
}

interface Funcao {
  funcao: string;
  count: number;
}

interface IGetCandidatosStatistics {
  totalTrabalhaSim: number;
  totalTrabalhaSimBiometriaSim: number;
  funcoes: Funcao[];
}

export interface IgetOldestDataAtualizacao {
  oldestData: string | null;
}
/**
 * Função que envia o arquivo para o endpoint e retorna uma mensagem de resposta.
 * @param file - O arquivo XLSX a ser enviado.
 * @returns Uma Promise que resolve com a mensagem retornada pelo backend.
 */
async function enviarArquivo(file: File): Promise<string> {
  const accessTokenData = localStorage.getItem('APP_ACCESS_TOKEN');
  if (accessTokenData) {
    const parsedData = JSON.parse(accessTokenData);
    await setAuthToken(parsedData.token);
  } else {
    setAuthToken(null);
  }
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await Api.post("/planilha/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data; // Assumindo que o backend retorne uma string de sucesso.
  } catch (error: any) {
    throw new Error(error);
  }
}

/**
 * Busca um candidato pelo prontuário.
 * @param prontuario - O prontuário do candidato a ser buscado.
 * @returns Uma Promise que resolve para os dados do candidato.
 */
async function getCandidatoByProntuario(prontuario: string): Promise<Candidato> {
  try {
    const accessTokenData = localStorage.getItem('APP_ACCESS_TOKEN');
    if (accessTokenData) {
      const parsedData = JSON.parse(accessTokenData);
      await setAuthToken(parsedData.token);
    } else {
      setAuthToken(null);
    }
    const response = await Api.get<Candidato>(`/candidatos/${prontuario}`);
    return response.data;
  } catch (error: any) {
    throw new Error("Erro ao buscar o candidato: " + error.message);
  }
}

async function getCandidatosStatistics(): Promise<IGetCandidatosStatistics | Error> {
  try {
    const accessTokenData = localStorage.getItem('APP_ACCESS_TOKEN');
    if (accessTokenData) {
      const parsedData = JSON.parse(accessTokenData);
      await setAuthToken(parsedData.token);
    } else {
      setAuthToken(null);
    }

    const response = await Api.get<IGetCandidatosStatistics>(`/candidatos/statistics`);

    if (response) {
      return response.data;
    }

    return new Error('Erro ao trazer estatisticas');
  } catch (error: any) {
    throw new Error("Erro ao buscar dados: " + error.message);
  }
}

async function getOldestDataAtualizacao(): Promise<IgetOldestDataAtualizacao | Error> {
  try {

    const accessTokenData = localStorage.getItem('APP_ACCESS_TOKEN');
    if (accessTokenData) {
      const parsedData = JSON.parse(accessTokenData);
      setAuthToken(parsedData.token);
    } else {
      setAuthToken(null);
    }

    const response = await Api.get<IgetOldestDataAtualizacao>(`/candidatos/oldest-data`);

    if (response) {
      return response.data;
    }

    return new Error('Erro ao trazer data da ultima atualizacao.');
  } catch (error: any) {
    throw new Error("Erro ao buscar data: " + error.message);
  }
}

const downloadRegistrosMalotePDF = async (): Promise<string | Error> => {
  try {
    const accessTokenData = localStorage.getItem('APP_ACCESS_TOKEN');
    if (accessTokenData) {
      const parsedData = JSON.parse(accessTokenData);
      setAuthToken(parsedData.token);
    } else {
      setAuthToken(null);
    }
    const response = await Api.get(`/api/pdf/gerarMalote`, { responseType: 'blob' });

    const dataAtual = new Date();
    const ano = dataAtual.getFullYear();
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); // Formata com 2 dígitos

    if(response.data.size == 0){
      return new Error("Erro no conteúdo  do PDF.");  
    }

    // Criar um link para download do arquivo
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Malote_${mes}_${ano}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return "response";

  } catch (error) {
    return new Error((error as { message: string }).message || "Erro ao baixar o PDF.");
  }
};

const getCandidatosFuncoes = async (): Promise<string[] | Error> => {
  try {
    const accessTokenData = localStorage.getItem('APP_ACCESS_TOKEN');
    if (accessTokenData) {
      const parsedData = JSON.parse(accessTokenData);
      await setAuthToken(parsedData.token);
    } else {
      setAuthToken(null);
    }

    const response = await Api.get<string[]>(`/candidatos/funcoes`);

    return response.data;
  } catch (error: any) {
    throw new Error("Erro ao buscar candidato com essa funcao: " + error.message);
  }
}


export const CandidatosService = {
  enviarArquivo,
  getCandidatoByProntuario,
  getOldestDataAtualizacao,
  getCandidatosStatistics,
  downloadRegistrosMalotePDF,
  getCandidatosFuncoes
}
