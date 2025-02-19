import { Api } from "../axios-config";

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

/**
 * Função que envia o arquivo para o endpoint e retorna uma mensagem de resposta.
 * @param file - O arquivo XLSX a ser enviado.
 * @returns Uma Promise que resolve com a mensagem retornada pelo backend.
 */
async function enviarArquivo(file: File): Promise<string> {
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
      const response = await Api.get<Candidato>(`/planilha/candidatos/${prontuario}`);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao buscar o candidato:", error);
      throw new Error("Erro ao buscar o candidato: " + error.message);
    }
  }

export const CandidatosService = {
    enviarArquivo,
    getCandidatoByProntuario
}
