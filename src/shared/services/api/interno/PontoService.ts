import { Api, setAuthToken } from "../axios-config";

interface IgetHorasTrabalhadas {
  funcionarioId: string;
  totalHorasTrabalhadas: string;
}

interface IRegistrarPonto {
  quantidade: number;
  entrada: string;
  saidaAlmoco: string;
  retornoAlmoco: string;
  saida: string;
}

interface IRegistroPontoResponse {
  registroPonto: IRegistrarPonto;
  nome: string;
  foto: string;
}

interface IRegistroFuncionario {
  id: number;
  funcionarioId: number;
  dia: string; // "YYYY-MM-DD"
  diaSemana: 'SUNDAY' | 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY';
  entrada: string;
  saidaAlmoco: string | null;
  retornoAlmoco: string | null;
  saida: string | null;
  horasTrabalhadas: string | null;
  observacao: string | null;
}

export type TgetRegistrosFuncionarioMes = IRegistroFuncionario[];

const registrarPonto = async (funcionarioId: number): Promise<IRegistrarPonto | Error> => {
  try {
    const response = await Api.post<IRegistrarPonto>(`/ponto/registrar/${funcionarioId}`);

    if (response) {
      return response.data;
    }

    return new Error('Erro ao registrar ponto.');

  } catch (error) {
    console.log(error);
    return new Error((error as { message: string }).message || "Erro ao registrar o ponto biometrico.");

  }
};

const getPorPeriodo = async (ano: number, mes: number): Promise<JSON | Error> => {
  try {
    const { data } = await Api.get(`/ponto/registros/mes?ano=${ano}&mes=${mes}`);

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');

  } catch (error) {
    console.log(error);
    return new Error((error as { message: string }).message || "Erro ao listar os registros.");
  }
};

const downloadRegistrosPDF = async (funcao: string | null,  ano: number, mes: number): Promise<string | Error> => {
  try {
    const accessTokenData = localStorage.getItem('APP_ACCESS_TOKEN');
    if (accessTokenData) {
      const parsedData = JSON.parse(accessTokenData);
      setAuthToken(parsedData.token);
    } else {
      setAuthToken(null);
    }

    // Define a URL de forma condicional:
    const urlApi = funcao && funcao.toLowerCase() !== 'todos'
      ? `/ponto/registros/funcionario/pdf?funcao=${funcao}&ano=${ano}&mes=${mes}`
      : `/ponto/registros/funcionario/pdf?ano=${ano}&mes=${mes}`;

      const response = await Api.get(urlApi, { responseType: 'blob' });

    if (response.status == 204){
       return new Error("Nenhum registro de ponto encontrado");
    }

    if (response.data.size == 0) {
      return new Error("Erro no conteúdo do PDF");
    }

    // Criar um link para download do arquivo
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `registros_${mes}_${ano}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return "response";

  } catch (error) {
    console.error("Erro ao baixar o PDF:", error);
    return new Error((error as { message: string }).message || "Erro ao baixar o PDF.");
  }
};

const downloadExcelRegistros = async (funcao: string | null, ano: number, mes: number): Promise<void> => {
  try {
    const accessTokenData = localStorage.getItem('APP_ACCESS_TOKEN');
    if (accessTokenData) {
      const parsedData = JSON.parse(accessTokenData);
      setAuthToken(parsedData.token);
    } else {
      setAuthToken(null);
    }

    // Monta os parâmetros condicionalmente
    const params: any = { ano, mes };
    if (funcao && funcao !== 'TODOS') {
      params.funcao = funcao;
    }

    const response = await Api.get(`/registros/mes/excel`, {
      params,
      responseType: 'blob', // importante para lidar com arquivos binários
    });

    // Cria um objeto Blob com o conteúdo retornado
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    // Cria uma URL temporária para o blob
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `registros_mes_${mes}_${ano}.xlsx`);

    // Anexa o link ao DOM, dispara o clique e o remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Libera o objeto URL criado
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro ao baixar o arquivo Excel:', error);
  }
};

const getRegistrosFuncionarioMes = async (funcionarioId: number, ano: number, mes: number): Promise<TgetRegistrosFuncionarioMes | Error> => {
  try {
    const accessTokenData = localStorage.getItem('APP_ACCESS_TOKEN');
    if (accessTokenData) {
      const parsedData = JSON.parse(accessTokenData);
      setAuthToken(parsedData.token);
    } else {
      setAuthToken(null);
    }
    const { data } = await Api.get<TgetRegistrosFuncionarioMes>(`/ponto/registros/funcionario?funcionarioId=${funcionarioId}&ano=${ano}&mes=${mes}`);

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');

  } catch (error) {
    console.log(error);
    return new Error((error as { message: string }).message || "Erro ao listar os registros.");
  }
};

const downloadRegistrosPDFporID = async (funcionarioId: number, ano: number, mes: number) => {
  try {
    const accessTokenData = localStorage.getItem('APP_ACCESS_TOKEN');

    if (accessTokenData) {
      const parsedData = JSON.parse(accessTokenData);
      setAuthToken(parsedData.token);
    } else {
      setAuthToken(null);
    }


    const response = await Api.get(`/ponto/registros/funcionario/pdf?funcionarioId=${funcionarioId}&ano=${ano}&mes=${mes}`, { responseType: 'blob' });

    if (response.data.size == 0) {
      return new Error("Erro no conteúdo  do PDF.");
    }

    // Criar um link para download do arquivo
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `registro_${mes}_${ano}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return "response";

  } catch (error) {
    return new Error((error as { message: string }).message || "Erro ao baixar o PDF.");
  }
};

const downloadExcelRegistrosporId = async (idFuncionario: number, ano: number, mes: number): Promise<void> => {
  try {
    const response = await Api.get(`/registros/mes/excel`, {
      params: { idFuncionario, ano, mes },
      responseType: 'blob', // importante para lidar com arquivos binários
    });

    // Cria um objeto Blob com o conteúdo retornado
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    // Cria uma URL temporária para o blob
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `registros_mes_${mes}_${ano}.xlsx`);

    // Anexa o link ao DOM, dispara o clique e o remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Libera o objeto URL criado
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro ao baixar o arquivo Excel:', error);
  }
};

const getHorasTrabalhadas = async (funcionarioId: number, ano: number, mes: number): Promise<IgetHorasTrabalhadas | Error> => {
  try {
    const { data } = await Api.get<IgetHorasTrabalhadas>(`/ponto/horas-trabalhadas?funcionarioId=${funcionarioId}&ano=${ano}&mes=${mes}`);

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');

  } catch (error) {
    console.log(error);
    return new Error((error as { message: string }).message || "Erro ao listar os registros.");
  }
};

const verifyFingerprint = async (biometria: any): Promise<IRegistroPontoResponse | Error> => {
  try {

    const accessTokenData = localStorage.getItem('APP_ACCESS_TOKEN');

    if (accessTokenData) {
      const parsedData = JSON.parse(accessTokenData);
      setAuthToken(parsedData.token);
    } else {
      setAuthToken(null);
    }

    const response = await Api.post<IRegistroPontoResponse>(`/api/verifyFingerprint`, biometria);
    if (response) {
      return response.data;
    }

    return new Error('Erro ao registrar ponto.');

  } catch (error) {
    return new Error((error as { message: string }).message || "Erro ao verificar a digital.");
  }
};

export const PontoService = {
  registrarPonto,
  getPorPeriodo,
  downloadRegistrosPDF,
  downloadExcelRegistros,
  getRegistrosFuncionarioMes,
  downloadRegistrosPDFporID,
  downloadExcelRegistrosporId,
  getHorasTrabalhadas,
  verifyFingerprint
};
