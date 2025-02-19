import { FerramentasDaListagem } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { useState } from "react";
import { Box, Button, Card, CardContent, LinearProgress, Typography } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { CandidatosService } from "../../shared/services/api/candidatos/CandidatosService"

 export const Config: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
  
      // Verifica se o arquivo é do tipo XLSX
      if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        alert("Por favor, selecione um arquivo .xlsx válido.");
        return;
      }
  
      setIsLoading(true);
      try {
        const mensagem = await CandidatosService.enviarArquivo(file);
        alert(mensagem);
      } catch (error: any) {
        if(error.message==='AxiosError: Request failed with status code 400'){
          alert("Coluna obrigatória não encontrada na planilha");
        }else {
          alert(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    
    const handleButtonClick = () => {
      document.getElementById("fileInput")?.click();
    };
     
  
    return (
        <LayoutBaseDePagina
            titulo="Configuração"
            barraDeFerramentas={
                <FerramentasDaListagem 
                  />
            }>

<Box p={3}>
      <Card>
        <CardContent>
            <Typography variant="h6" gutterBottom>
                ATUALIZAR AUTOCOMPLETE PELOS PRONTUÁRIOS
            </Typography>

          
          <Box mt={2} display="flex" gap="10px" justifyContent="flex-end" marginBottom={2}>
          <input
                id="fileInput"
                type="file"
                accept=".xlsx"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
              <Button 
                variant="contained" 
                color="success" 
                startIcon={<UploadFileIcon />} 
                onClick={handleButtonClick}
                disabled={isLoading}
              >
                ENVIAR ARQUIVO EXCEL
              </Button>
              {isLoading &&(<LinearProgress variant="indeterminate" />)}
            </Box>

        </CardContent>
      </Card>
    </Box>

        </LayoutBaseDePagina>
    )
 };