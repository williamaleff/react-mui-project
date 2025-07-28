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
    const response = await Api.post("/malote/planilha/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data; // Assumindo que o backend retorne uma string de sucesso.
  } catch (error: any) {
    throw new Error(error);
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

    const response = await Api.get<IgetOldestDataAtualizacao>(`/malote/oldest-data`);

    if (response) {
      return response.data;
    }

    return new Error('Erro ao trazer data da ultima atualizacao.');
  } catch (error: any) {
    throw new Error("Erro ao buscar data: " + error.message);
  }
}

const downloadRegistrosMalotePDF = async (paga: number, mes: number): Promise<string | Error> => {
  try {
    const accessTokenData = localStorage.getItem('APP_ACCESS_TOKEN');
    if (accessTokenData) {
      const parsedData = JSON.parse(accessTokenData);
      setAuthToken(parsedData.token);
    } else {
      setAuthToken(null);
    }
    const response = await Api.get(`/malote/pdf/gerarMalote`, {
       params: {
          paga,
          mes
       },
       responseType: 'blob' 
      });

    const dataAtual = new Date();
    const anoAtual = dataAtual.getFullYear();
    const mesAtual = String(dataAtual.getMonth() + 1).padStart(2, '0'); // Formata com 2 dígitos

    if(response.data.size == 0){
      return new Error("Erro no conteúdo  do PDF.");  
    }

    // Criar um link para download do arquivo
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Malote_${mesAtual}_${anoAtual}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return "response";

  } catch (error) {
    return new Error((error as { message: string }).message || "Erro ao baixar o PDF.");
  }
};


export const MaloteService = {
  enviarArquivo,
  getOldestDataAtualizacao,
  downloadRegistrosMalotePDF,
}
