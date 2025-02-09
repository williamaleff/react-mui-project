import { Api } from "../axios-config";

export const registrarPonto = async (funcionarioId: number): Promise<void> => {
  try {
    const response = await Api.post<string>(`/ponto/registrar/${funcionarioId}`);
    console.log(response.data); // Exibe a mensagem: "Ponto registrado com sucesso!"
  } catch (error) {
    // Aqui você pode tratar o erro (por exemplo, exibir uma mensagem para o usuário)
    console.error("Erro ao registrar o ponto:", error);
  }
};

export const getPorPeriodo = async (ano: number, mes: number): Promise<JSON | Error> => {
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

