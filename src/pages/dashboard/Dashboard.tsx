import { Box, Card, CardContent, Grid, Snackbar, Typography } from "@mui/material";
import { FerramentasDaListagem} from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { useEffect, useRef, useState } from "react";
import Chart from "react-google-charts";
import { CandidatosService } from "../../shared/services/api/candidatos/CandidatosService";
import { Alert } from "../../shared/forms/Alert";

const colorScheme = [
    "#4e73df", "#1cc88a", "#36b9cc", "#f6c23e", "#e74a3b",
    "#858796", "#f8f9fc", "#5a5c69", "#25ccf7", "#fd7272",
    "#54a0ff", "#00d2d3", "#1abc9c", "#2ecc71", "#3498db", 
    "#54a0ff", "#00d2d3", "#1abc9c", "#2ecc71", "#3498db", 
    "#54a0ff", "#00d2d3", "#1abc9c", "#2ecc71", "#3498db",
    "#54a0ff", "#00d2d3", "#1abc9c", "#2ecc71", "#3498db" 
]  

export const Dashboard = () => {

    const [isLoadingAgente, setIsLoadingMonth] = useState(true);
    const [totalFuncoes, setTotalFuncoes] = useState(0);
    const [isLoadingTipos, setIsLoadingDay] = useState(true);
    const [totalInternosTrabalho, setTotalInternosTrabalho] = useState(0);
    const [isLoadingChamado, setIsLoadingChamado] = useState(true);
    const [totalCountBiometria, setTotalCountBiometria] = useState(0);
    const hasFetchedData = useRef(false);
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

    const contentRef = useRef<HTMLDivElement>(null);
   
    const [data, setData] = useState<(string | number | { role: string })[][]>([
        ["Funcoes", "Internos",{ role: "annotation" }, { role: "style" }],
    ]);

    // Calcule o maior valor dos counts (excluindo o cabeçalho)
    const maxCount =
    data.length > 1
      ? data.slice(1).reduce((max, row) => Math.max(max, row[1] as number), 0)
      : 0;

    // Acrescente 20% de margem (pode ajustar conforme necessário)
    const vAxisMax = maxCount > 0 ? maxCount + Math.ceil(maxCount * 0.6) : 10;

    useEffect(() => {
        const fetchData = async () => {
            setIsLoadingMonth(true);
            setIsLoadingDay(true);
            setIsLoadingChamado(true);

            try{
            await CandidatosService.getCandidatosStatistics().then((e)=>{

                if (!(e instanceof Error)) {
                
                    setTotalInternosTrabalho(e.totalTrabalhaSim);
                    setTotalCountBiometria(e.totalTrabalhaSimBiometriaSim)
                    setTotalFuncoes(e.funcoes.length);
                     
                    const chartData = e.funcoes.map((item, i) => [
                         item.funcao, 
                         item.count,
                         item.count.toString(),
                         colorScheme[i % colorScheme.length],
                     ]);

                     if (!hasFetchedData.current) {
                         setData((prevData) => [...prevData, ...chartData]);
                         hasFetchedData.current = true; 
                     }
                     
                } else {
                    setErrorMessage(e.message);
                    setOpenError(true);
                }

            });
            
            } catch (error) {
                setErrorMessage("Erro ao buscar dados: " + (error as Error).message);
                setOpenError(true);  
            } finally {
                setIsLoadingMonth(false);
                setIsLoadingDay(false);
                setIsLoadingChamado(false);
            }
        };

        fetchData();

    }, []);

    return (
        <LayoutBaseDePagina 
        titulo="Dashboard" 
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
	
            <Box height='100%' ref={contentRef} >
            <Box width='100%' display='flex' height='40%'>

                <Grid container margin={2}>
                    <Grid item container spacing={2}>
                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" align="center">
                                    Internos que trabalham
                                </Typography>
                                <Box padding={2} display='flex' justifyContent='center' alignItems='center'>
                                {!isLoadingChamado &&(
                                    <Typography variant="h3">
                                        {totalInternosTrabalho}
                                    </Typography>
                                    )}
                                    {isLoadingChamado &&(
                                    <Typography variant="h6">
                                        Carregando...
                                    </Typography>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" align="center">
                                   Tem biometria
                                </Typography>
                                <Box padding={2} display='flex' justifyContent='center' alignItems='center'>
                                {!isLoadingTipos &&(
                                    <Typography variant="h3">
                                        {totalCountBiometria}
                                    </Typography>
                                    )}
                                    {isLoadingTipos &&(
                                    <Typography variant="h6">
                                        Carregando...
                                    </Typography>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" align="center">
                                    Funcoes
                                </Typography>
                                <Box padding={2} display='flex' justifyContent='center' alignItems='center'>
                                {!isLoadingAgente &&(
                                    <Typography variant="h3">
                                        {totalFuncoes}
                                    </Typography>
                                    )}
                                    {isLoadingAgente &&(
                                    <Typography variant="h6">
                                        Carregando...
                                    </Typography>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Card>
                            <CardContent>
                                <Typography variant="h6" align="center">
                                    Total de Trabalhadores em gráfico
                                </Typography>
                                <Box padding={2} display='flex' justifyContent='center' alignItems='center'>
                                 {totalInternosTrabalho !== 0 && !isLoadingChamado &&(   
                                    <Chart
                                        chartType="ColumnChart"
                                        width="100%"
                                        height="100%"
                                        data={data}
                                        options={{
                                            // Exibe as anotações (números) sempre fora da coluna
                                            annotations: {
                                              alwaysOutside: true,
                                              textStyle: { fontSize: 12, color: "#000", auraColor: "none" },
                                            },
                                            chartArea: {
                                              top: 50,
                                              bottom: 80,
                                              left: 50,
                                              right: 150, // aumenta o espaço à direita para a legenda
                                            },
                                            legend: {
                                              position: "right",
                                              textStyle: { fontSize: 10 },
                                              alignment: "center",
                                            },
                                            hAxis: {
                                              slantedText: true,
                                              slantedTextAngle: 45,
                                            },vAxis: {
                                                viewWindow: {
                                                  max: vAxisMax,
                                                },
                                                ticks: [0, vAxisMax / 2, vAxisMax],
                                            },
                                          }}
                                        legendToggle={false}
                                    />
                                )}
                                    {isLoadingChamado &&(
                                    <Typography variant="h6">
                                        Carregando...
                                    </Typography>
                                    )}
                                    {totalInternosTrabalho === 0 && !isLoadingChamado &&(   
                                    <Typography variant="h6">
                                        Sem dados.
                                    </Typography>
                                    )}
                                </Box>
                            </CardContent>
                            </Card>
                        </Grid>

                    </Grid>
                </Grid>
              
            </Box>
            </Box>
        </LayoutBaseDePagina>
    );
}