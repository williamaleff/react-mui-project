import { Api } from "../axios-config";

interface horasTrabalhadas {
  funcionarioId: string;
  totalHorasTrabalhadas: string;
}
const registrarPonto = async (funcionarioId: number): Promise<void> => {
  try {
    const response = await Api.post<string>(`/ponto/registrar/${funcionarioId}`);
    console.log(response.data); // Exibe a mensagem: "Ponto registrado com sucesso!"
  } catch (error) {
    // Aqui você pode tratar o erro (por exemplo, exibir uma mensagem para o usuário)
    console.error("Erro ao registrar o ponto:", error);
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
        return new Error((error as {message: string}).message || "Erro ao listar os registros.");
    }
 };

const downloadRegistrosPDF = async (ano: number, mes: number) => {
    try {
        const response = await Api.get(`/ponto/pdf/registros/mes?ano=${ano}&mes=${mes}`, {responseType: 'blob'});

        // Criar um link para download do arquivo
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `registros_${mes}_${ano}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    } catch (error) {
        console.error("Erro ao baixar o PDF:", error);
    }
};

const downloadExcelRegistros = async (ano: number, mes: number): Promise<void> => {
    try {
      const response = await Api.get(`ponto/registros/mes/excel`, {
        params: { ano, mes },
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

const getRegistrosFuncionarioMes = async (funcionarioId: number, ano: number, mes: number): Promise<JSON | Error> => {
    try {
        const { data } = await Api.get(`/ponto/registros/funcionario?funcionarioId=${funcionarioId}&ano=${ano}&mes=${mes}`);

        if (data) {
            return data;            
        }

        return new Error('Erro ao consultar o registro.');
        
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao listar os registros.");
    }
};

const downloadRegistrosPDFporID = async (funcionarioId: number, ano: number, mes: number) => {
    try {
        const response = await Api.get(`/ponto/registros/funcionario/pdf?funcionarioId=${funcionarioId}&ano=${ano}&mes=${mes}`, {responseType: 'blob'});

        // Criar um link para download do arquivo
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `registros_${mes}_${ano}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    } catch (error) {
        console.error("Erro ao baixar o PDF:", error);
    }
};

const downloadExcelRegistrosporId = async (funcionarioId: number, ano: number, mes: number): Promise<void> => {
    try {
      const response = await Api.get(`/ponto/registros/funcionario/excel`, {
        params: {funcionarioId, ano, mes },
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

const getHorasTrabalhadas = async (funcionarioId: number, ano: number, mes: number): Promise<horasTrabalhadas | Error> => {
    try {
        const { data } = await Api.get<horasTrabalhadas>(`/ponto/horas-trabalhadas?funcionarioId=${funcionarioId}&ano=${ano}&mes=${mes}`);

        if (data) {
            return data;            
        }

        return new Error('Erro ao consultar o registro.');
        
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao listar os registros.");
    }
};

const verifyFingerprint = async (biometria: any): Promise<any | Error> => {
    try {
      const response = await Api.post<JSON>(`/api/verifyFingerprint`, biometria);
      if (response) {
        return response;            
    }
    
    } catch (error) {
        return new Error((error as {message: string}).message || "Erro ao verificar a digital.");
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
