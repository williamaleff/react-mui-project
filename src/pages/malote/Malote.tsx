import { FerramentasDaListagem } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, CircularProgress, LinearProgress, Snackbar, ToggleButtonGroup, Typography, ToggleButton, InputLabel, FormControl, Select, MenuItem } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Alert } from "../../shared/forms/Alert";
import DownloadIcon from "@mui/icons-material/Download";
import { SelectChangeEvent } from '@mui/material/Select';
import { MaloteService } from "../../shared/services/api/malote/MaloteService";


export const Malote: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [atualizaData, setAtualizaData] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openError, setOpenError] = useState(false);
  const [pagamento, setPagamento] = useState("1");

  // Pega o mês atual (1 a 12) como valor inicial
  const currentMonth = new Date().getMonth() + 1;
  const [mes, setMes] = useState(currentMonth.toString());

  const meses = [
    { value: "1", label: "Janeiro" },
    { value: "2", label: "Fevereiro" },
    { value: "3", label: "Março" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Maio" },
    { value: "6", label: "Junho" },
    { value: "7", label: "Julho" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" },
  ];

  const handlePagamentoChange = (
    _event: React.MouseEvent<HTMLElement>,
    newValue: string
  ) => {
    if (newValue !== null) {
      setPagamento(newValue);
    }
  };

  const handleMesChange = (event: SelectChangeEvent<string>) => {
    setMes(event.target.value);
  };

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


    MaloteService.getOldestDataAtualizacao()
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
      const mensagem = await MaloteService.enviarArquivo(file);
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

    const paga = Number(pagamento);
    const mesSelecionado = Number(mes);

    await MaloteService.downloadRegistrosMalotePDF(paga, mesSelecionado).then((e) => {
      if (e instanceof Error) {
        setErrorMessage(e.message);
        setOpenError(true);
      }

    });
    setIsLoading(false);



  };



  return (
    <LayoutBaseDePagina
      titulo="Malote"
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
              IMPRIMIR MALOTE PARA ASSINATURA POR ALA
            </Typography>
            <Typography>
              Última atualização em {atualizaData}
            </Typography>
            <Typography sx={{ mb: 2 }}>
              Obs: Enviar arquivo .xlsx do sigepen contendo tipo_de_regime,
              ultima_localizacao, unidade, prontuario, nome, mae
            </Typography>


            {isLoading && (<LinearProgress variant="indeterminate" />)}

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, marginBlock: 3 }}>

              <ToggleButtonGroup
                value={pagamento}
                exclusive
                onChange={handlePagamentoChange}
                aria-label="tipo de paga"
                sx={{
                  backgroundColor: '#f5f5f5',
                  borderRadius: 2,
                  boxShadow: 1,
                }}
              >
                <ToggleButton
                  value="1"
                  sx={{
                    px: 3,
                    py: 1.2,
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    '&.Mui-selected': {
                      backgroundColor: '#ffeb3b',
                      color: '#000',
                      '&:hover': {
                        backgroundColor: '#fdd835',
                      },
                    },
                  }}
                >
                  1º paga
                </ToggleButton>
                <ToggleButton
                  value="2"
                  sx={{
                    px: 3,
                    py: 1.2,
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    '&.Mui-selected': {
                      backgroundColor: '#ffeb3b',
                      color: '#000',
                      '&:hover': {
                        backgroundColor: '#fdd835',
                      },
                    },
                  }}
                >
                  2º paga
                </ToggleButton>
              </ToggleButtonGroup>
              <FormControl fullWidth sx={{ maxWidth: 240 }}>
                <InputLabel id="mes-label">Mês do malote</InputLabel>
                <Select
                  labelId="mes-label"
                  value={mes}
                  label="Mês do malote"
                  onChange={handleMesChange}
                >
                  {meses.map((m) => (
                    <MenuItem key={m.value} value={m.value}>
                      {m.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

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
                color="primary"
                onClick={handleButtonClick}
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} /> : <UploadFileIcon />}
              >
                {isLoading ? "Carregando..." : "ENVIAR ARQUIVO EXCEL"}
              </Button>

            </Box>
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