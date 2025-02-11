import { useEffect, useState } from "react";
import { Container, Box, Typography, Paper } from "@mui/material";
import { PontoService } from "../../shared/services/api/interno/PontoService";

export default function ClockPage() {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("pt-BR"));
      setDate(now.toLocaleDateString("pt-BR"));
    };

    const interval = setInterval(updateClock, 1000);
    updateClock();
    return () => clearInterval(interval);
  }, []);

  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");

  const handleBiometricClick = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:9000/api/public/v1/captura/Capturar/1');
      const data = await response.json();
      setValue(data)
      console.log("Resposta da API:", data);
      if(data == null){
        alert("Sem resposta do leitor biométrico.")
      }else{
        const dados ={
            "fingerprint": data
         };
        await PontoService.verifyFingerprint(dados).then((e) => {
            if (e instanceof Error) {
                alert(e.message);                    
            }else{
                const id: number = e.data.id;
                PontoService.registrarPonto(id);
            }
        });
      }

    } catch (error) {
      console.error("Erro ao chamar API:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", bgcolor: "#f4f4f4", p: 3 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: "center" }}>
        <Box display="flex" alignItems="center" gap={2}>
          <img
            width={64}
            src="https://brasao.org/wp-content/uploads/2018/10/brasao-do-ceara.png"
            alt="Logo do estado do Ceará"
          />
          <Box>
            <Typography variant="h6" fontWeight="bold">Governo do Estado do Ceará</Typography>
            <Typography variant="subtitle2">Secretaria da Administração Penitenciária</Typography>
          </Box>
        </Box>
        <img 
            width={192} 
            src="/img/pontoBiometrico.png" 
            alt="Ponto Biométrico" 
            style={{ marginTop: 16 }} 
            onClick={handleBiometricClick} 
        />
        <Typography variant="h6" sx={{ mt: 2 }}>Quinta-feira, <span>{date}</span></Typography>
        <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>{time}</Typography>
      </Paper>
    </Container>
  );
}
