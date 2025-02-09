import { Api } from "../axios-config";

interface UploadResponse {
    url: string;
}

const create = async (dados: FormData): Promise<any | Error> => { 
    try {
        const { data } = await Api.post<UploadResponse>(`/upload`, dados);

        if (data) {
            return data;            
        }

        return new Error('Erro ao fazer upload da foto.');
        
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao fazer upload da foto.");
    }
};

const getByfile = async (file: string): Promise<Blob | Error> => {
    try {
        const fileName = file.split("/").pop();
        const { data } = await Api.get(`/uploads/${fileName}`, { responseType: "blob" });

        if (data) {
            return data;            
        }

        return new Error('Erro ao consultar foto.');
        
    } catch (error) {
        console.log(error);
        return new Error((error as {message: string}).message || "Erro ao consultar foto.");
    }
 };


export const Upload = {
    create,
    getByfile
};
