import React, { useEffect, useRef, useState } from "react";
import { Container, Box, Typography, Paper, Avatar, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Snackbar, AlertProps, LinearProgress } from "@mui/material";
import { PontoService } from "../../shared/services/api/interno/PontoService";
import { UploadService } from "../../shared/services/api/interno/UploadService";
import MuiAlert from '@mui/material/Alert';

// Componente Alert customizado usando o forwardRef
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ClockPage() {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [exibindoInfo, setExibindoInfo] = useState(false);
  const [loading, setLoading] = useState(false);

  const [foto, setFoto] = useState('')
  const [nome, setNome] = useState("")
  const [frequencia, setFrequencia ] = useState("")
  const [horario, setHorario] = useState('00:00:00')
  const [primeira, setPrimeira] = useState('00:00:00')
  const [segunda, setSegunda] = useState('00:00:00')
  const [terceira, setTerceira] = useState('00:00:00')
  const [quarta, setQuarta] = useState('00:00:00')
  const [diaExtenso, setDiaExtenso] = useState('')

   // Estados para a mensagem de erro e controle do Snackbar
   const [errorMessage, setErrorMessage] = useState<string | null>(null);
   const [openError, setOpenError] = useState(false);
 
   const isRunning = useRef(true); // Controla se o loop está ativo

   // Função para fechar o Snackbar
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
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("pt-BR"));
      setDate(now.toLocaleDateString("pt-BR"));
    };

    const diasDaSemana = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
    const hoje = new Date();
    setDiaExtenso(diasDaSemana[hoje.getDay()]);

    const interval = setInterval(updateClock, 1000);
    updateClock();
    
    return () => clearInterval(interval);
    
  }, []);

  useEffect(() => {
    isRunning.current = true; // Ativa o loop ao montar
    handleBiometricClick(); // Inicia o processo de captura
    return () => {
      isRunning.current = false; // Para o loop ao desmontar
    };
  }, []);

  function hasMessage(obj: any): obj is { message: string } {
    return typeof obj.message === 'string';
}

  const handleBiometricClick = async () => {
    if (!isRunning.current) return; // Se o loop foi parado, não faz mais requisições

    setLoading(true);
    try {
      const response = await fetch('http://localhost:9000/api/public/v1/captura/Capturar/1');
      const data = await response.json();
      if(data == null){
        console.log("Sem resposta do leitor biométrico.")
      }else{
        const dados ={
            "fingerprint": data
         };

        await PontoService.verifyFingerprint(dados).then(async (e) => {
            if (e instanceof Error) {
              if(e.message === 'Request failed with status code 500'){
                setErrorMessage("Não é possível registrar o ponto mais de 4 vezes");
                setOpenError(true);
                setLoading(false);
                return; // Para a execução da função
              }else if(e.message === 'Request failed with status code 400'){
                setErrorMessage("Aguarde 10 minutos antes de registrar novamente.");
                setOpenError(true);
                setLoading(false);
                return; // Para a execução da função
              }

                console.log(e.message);                    
            }else{
              // Verifica se a mensagem é "Digital não cadastrada"
               if (hasMessage(e) && e.message === 'Digital não cadastrada') {
                //alert(e.message);
                setErrorMessage(e.message);
                setOpenError(true);
                setLoading(false);
                return; // Para a execução da função
                }
                  setHorario(time)
                  setFrequencia(String(e.registroPonto.quantidade))
                  
                  if(e.registroPonto.entrada!=null){
                    const horaFormatada1 = e.registroPonto.entrada.split('.')[0];
                    setPrimeira(horaFormatada1)
                  }else{
                    setPrimeira(e.registroPonto.entrada)
                  }

                  if(e.registroPonto.saidaAlmoco!=null){
                    const horaFormatada2 = e.registroPonto.saidaAlmoco.split('.')[0];
                    setSegunda(horaFormatada2)
                  } else {
                    setSegunda(e.registroPonto.saidaAlmoco)
                  }

                  if(e.registroPonto.retornoAlmoco!=null){
                    const horaFormatada3 = e.registroPonto.retornoAlmoco.split('.')[0];
                    setTerceira(horaFormatada3)
                  }else {
                    setTerceira(e.registroPonto.retornoAlmoco)
                  }

                  if(e.registroPonto.saida!=null){
                  const horaFormatada4 = e.registroPonto.saida.split('.')[0];
                  setQuarta(horaFormatada4)
                  }else{
                  setQuarta(e.registroPonto.saida)
                  }
                  
                  setNome(e.nome);
                  setExibindoInfo(true)
                            
                  await UploadService.getByfile(e.foto).then(async(data) => {
                    setLoading(false);                  
                    if (data instanceof Error) {
                      alert(data.message);                    
                    } else {
                     const imageUrlPreview = URL.createObjectURL(data);
                      setFoto(imageUrlPreview)
                    }              
                    })

                    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
                    await delay(5000);
                    setExibindoInfo(false)                            
                        }});
                      }

        // Exibe os dados por 15 segundos e depois oculta
        setTimeout(() => {
          setExibindoInfo(false);
        }, 15000);
      

    } catch (error) {
      console.error("Erro ao chamar API:", error);
    } finally {
      setLoading(false);
    }

    // Espera um tempo antes de chamar novamente para evitar sobrecarga na API
    setTimeout(() => {
      if (isRunning.current) {
        handleBiometricClick();
      }
    }, 5000); // Aguarda 5 segundos antes da próxima chamada

  };

  // Inicia a captura ao clicar na imagem do ponto biométrico
  const startLoop = () => {
    if (!isRunning.current) {
      isRunning.current = true;
      handleBiometricClick();
      console.log("Loop iniciado!");
    }
  };

  // Para a captura ao pressionar a tecla ESC
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        isRunning.current = false;
        console.log("Loop parado!");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Container maxWidth="sm" sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", bgcolor: "#f4f4f4", p: 3 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: "center" }}>
        <Box display="flex" alignItems="center" gap={2} margin={3} marginLeft={5}>
          <img
            width={64}
            src="./img/brasao-do-ceara.png"
            alt="Logo do estado do Ceará"
          />
          <Box>
            <Typography variant="h6" fontWeight="bold">Governo do Estado do Ceará</Typography>
            <Typography variant="subtitle2">Secretaria da Administração Penitenciária</Typography>
          </Box>
        </Box>

        {loading && <LinearProgress variant="indeterminate" />}
        
        {!exibindoInfo &&(
        <img 
            width={192} 
            src="./img/pontoBiometrico.png" 
            alt="Ponto Biométrico" 
            style={{ marginTop: 16 }} 
            onClick={startLoop} 
        />
        )}

        {exibindoInfo &&(
          <Box>
          <Box display="flex" justifyContent="center" alignItems="center" gap={1} mb={2}>
            <Avatar src={foto || ""} sx={{ width: 80, height: 80 }} />
            <Typography variant="h6" fontWeight="medium">
              {nome}
            </Typography>
          </Box>
  
        <Typography variant="h5" color="green" fontWeight="bold" mt={2}>{frequencia}º FREQUÊNCIA REGISTRADA</Typography>
        <Typography variant="h6" color="green" fontWeight="bold" mt={1}>{horario}</Typography>
  
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#ddd" }}>
                <TableCell align="center">1º</TableCell>
                <TableCell align="center">2º</TableCell>
                <TableCell align="center">3º</TableCell>
                <TableCell align="center">4º</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align="center">{primeira}</TableCell>
                <TableCell align="center">{segunda}</TableCell>
                <TableCell align="center">{terceira}</TableCell>
                <TableCell align="center">{quarta}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        </Box>

        )}
        <Typography variant="h6" sx={{ mt: 2 }}>{diaExtenso}, <span>{date}</span></Typography>
        {!exibindoInfo &&(
          <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>{time}</Typography>
        )}
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
      </Paper>
    </Container>
  );
}
