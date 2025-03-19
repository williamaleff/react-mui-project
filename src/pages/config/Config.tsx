import { FerramentasDaListagem } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, CircularProgress, LinearProgress, Snackbar, Typography } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { CandidatosService } from "../../shared/services/api/candidatos/CandidatosService"
import { Alert } from "../../shared/forms/Alert";
import DownloadIcon from "@mui/icons-material/Download";

export const Config: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [atualizaData, setAtualizaData] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openError, setOpenError] = useState(false);
  

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenError(false);
  };

  useEffect(() => {
    setIsLoading(true);


    CandidatosService.getOldestDataAtualizacao()
      .then((result) => {
        setIsLoading(false);

        if (result instanceof Error) {
          setErrorMessage(result.message);
          setOpenError(true);

          const accessToken = localStorage.getItem('APP_ACCESS_TOKEN');
          if (accessToken) {
            // Remove o token
            localStorage.removeItem('APP_ACCESS_TOKEN');
            console.log('Token removido com sucesso.');
            window.location.reload();
          } else {
            console.log('Nenhum token encontrado.');
          }

        } else {

          const dateStr = result.oldestData ? result.oldestData : null;

          if (dateStr) {
            // Separa a parte da data e do horário
            const [datePart, timePart] = dateStr.split('T');
            // Separa ano, mês e dia
            const [year, month, day] = datePart.split('-');
            // Remove os milissegundos do horário
            const [time] = timePart.split('.');

            const formattedDate = `${day}/${month}/${year} às ${time}`;
            setAtualizaData(formattedDate)
          }


        }
      });

  }, [])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {

    const file = event.target.files?.[0];
    if (!file) return;
    setIsLoading(true);

    // Verifica se o arquivo é do tipo XLSX
    if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      setErrorMessage("Por favor, selecione um arquivo .xlsx válido.");
      setOpenError(true);
      setIsLoading(false);
      return;
    }


    try {
      const mensagem = await CandidatosService.enviarArquivo(file);
      alert(mensagem);
    } catch (error: any) {
      if (error.message === 'AxiosError: Request failed with status code 400') {
        setErrorMessage("Coluna obrigatória não encontrada na planilha");
        setOpenError(true);
      } else {
        setErrorMessage(error.message);
        setOpenError(true);
      }
    } finally {
      setIsLoading(false);
    }
  };


  const handleButtonClick = () => {
    document.getElementById("fileInput")?.click();
  };

  const handleClickPDF = async () => {
    setIsLoading(true);

    await CandidatosService.downloadRegistrosMalotePDF().then((e) => {
      if (e instanceof Error) {
        setErrorMessage(e.message);
        setOpenError(true);
      }

    });
    setIsLoading(false);



  };



  return (
    <LayoutBaseDePagina
      titulo="Configuração"
      barraDeFerramentas={
        <FerramentasDaListagem
        />
      }>

      <Snackbar
        open={openError}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>


      <Box p={3} display="flex" flexDirection="column" gap={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              ATUALIZAR AUTOCOMPLETE PELOS PRONTUÁRIOS
            </Typography>
            <Typography>
              Última atualização em {atualizaData}
            </Typography>

            {isLoading && (<LinearProgress variant="indeterminate" />)}

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
                onClick={handleButtonClick}
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} /> : <UploadFileIcon />}
              >
                {isLoading ? "Carregando..." : "ENVIAR ARQUIVO EXCEL"}
              </Button>
            </Box>

          </CardContent>  
        </Card>
        <Card>
        <CardContent>
            <Typography variant="h6" gutterBottom>
              IMPRIMIR MALOTE PARA ASSINATURA POR ALA
            </Typography>

            {isLoading && (<LinearProgress variant="indeterminate" />)}

            <Box mt={2} display="flex" gap="10px" justifyContent="flex-end" marginBottom={2}>
              <Button
                variant="contained"
                color="success"
                onClick={handleClickPDF}
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} /> : <DownloadIcon />}
              >
                {isLoading ? "Carregando..." : "Baixar PDF"}
              </Button>
            </Box>

          </CardContent>

        </Card>
      </Box>

    </LayoutBaseDePagina>
  )
};