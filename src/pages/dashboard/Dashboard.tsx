import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { FerramentasDaListagem} from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { useEffect, useRef, useState } from "react";
import { TiposService } from "../../shared/services/api/tipos/TiposService";
import { ChamadoService } from "../../shared/services/api/chamado/ChamadoService";
import Chart from "react-google-charts";

interface TipoIdCount {
    tipoId: string;
    count: number;
  }

const colorScheme = [
    "#4e73df", "#1cc88a", "#36b9cc", "#f6c23e", "#e74a3b",
    "#858796", "#f8f9fc", "#5a5c69", "#25ccf7", "#fd7272",
    "#54a0ff", "#00d2d3", "#1abc9c", "#2ecc71", "#3498db" 
]  

export const Dashboard = () => {

    /////////////////DATA//////////////////////////////////////

const horarioAtual = new Date().toLocaleTimeString();
const fullYear = new Date().getFullYear().toString();
const month = (new Date().getMonth() + 1).toString().padStart(2, "0");
const day = new Date().getDate().toString().padStart(2, "0");
const todayOfTheTime =
  fullYear + "-" + month + "-" + day + "T" + horarioAtual;
const DayOneOfMonth =
fullYear + "-" + month + "-" + "01"

//////////////////////////////////////////////////////////

    const [isLoadingAgente, setIsLoadingMonth] = useState(true);
    const [totalCountMonth, setTotalCountMonth] = useState(0);
    const [isLoadingTipos, setIsLoadingDay] = useState(true);
    const [totalCountDay, setTotalCountDay] = useState(0);
    const [isLoadingChamado, setIsLoadingChamado] = useState(true);
    const [totalCountChamado, setTotalCountChamado] = useState(0);
    const hasFetchedData = useRef(false);

    const [data, setData] = useState<(string | number | { role: string })[][]>([
        ["Tipos", "Chamados", { role: "style" }],
    ]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoadingMonth(true);
            setIsLoadingDay(true);
            setIsLoadingChamado(true);

            try {
                const [MonthResult, tiposResult, DayResult, chamadoResult] = await Promise.all([
                    ChamadoService.getDate(1, todayOfTheTime, DayOneOfMonth),
                    TiposService.getAll(1),
                    ChamadoService.getDate(1, todayOfTheTime),
                    ChamadoService.getAll(1),
                ]);

                if (!(DayResult instanceof Error)) {
                    setTotalCountDay(DayResult.totalCount);
                } else {
                    alert(DayResult.message);
                }

                if (!(MonthResult instanceof Error)) {
                    setTotalCountMonth(MonthResult.totalCount);
                } else {
                    alert(MonthResult.message);
                }


                if (tiposResult instanceof Error) {
                    alert(tiposResult.message);
                } else {
                    
                    const tipoMap = tiposResult.data.reduce<Record<string, string>>((acc, tipo) => {
                        acc[tipo.id] = tipo.nome; 
                        return acc;
                    }, {});

                if (chamadoResult instanceof Error) {
                    alert(chamadoResult.message);
                } else {
                    const tipoIdCounts = chamadoResult.data.reduce<Record<string, number>>((acc, item) => {
                        acc[item.tipoId] = (acc[item.tipoId] || 0) + 1;
                        return acc;
                    }, {});

                    const uniqueTipoIdCounts: TipoIdCount[] = Object.entries(tipoIdCounts).map(([tipoId, count]) => ({
                        tipoId,
                        count,
                    }));

                    const chartData = uniqueTipoIdCounts.map((item, i) => [
                        tipoMap[item.tipoId] || item.tipoId, 
                        item.count,
                        colorScheme[i],
                    ]);

                    if (!hasFetchedData.current) {
                        setData((prevData) => [...prevData, ...chartData]);
                        hasFetchedData.current = true; 
                    }
                    
                    
                    setTotalCountChamado(chamadoResult.totalCount);
                }
            }
            } catch (error) {
                alert("Erro ao buscar dados: " + (error as Error).message);
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
        titulo="Página Inicial" 
        barraDeFerramentas={
        <FerramentasDaListagem
            mostrarBotaoNovo={false} 
            mostrarBotaoImpressao={true}    
        />

        }>
            <Box height='100%'>
            <Box width='100%' display='flex' height='40%'>

                <Grid container margin={2}>
                    <Grid item container spacing={2}>
                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" align="center">
                                    Pendentes
                                </Typography>
                                <Box padding={2} display='flex' justifyContent='center' alignItems='center'>
                                {!isLoadingChamado &&(
                                    <Typography variant="h3">
                                        {totalCountChamado}
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
                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" align="center">
                                    Hoje
                                </Typography>
                                <Box padding={2} display='flex' justifyContent='center' alignItems='center'>
                                {!isLoadingTipos &&(
                                    <Typography variant="h3">
                                        {totalCountDay}
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
                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" align="center">
                                    Mensal
                                </Typography>
                                <Box padding={2} display='flex' justifyContent='center' alignItems='center'>
                                {!isLoadingAgente &&(
                                    <Typography variant="h3">
                                        {totalCountMonth}
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
                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" align="center">
                                    Total
                                </Typography>
                                <Box padding={2} display='flex' justifyContent='center' alignItems='center'>
                                {!isLoadingChamado &&(
                                    <Typography variant="h3">
                                        {totalCountChamado}
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
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Card>
                            <CardContent>
                                <Typography variant="h6" align="center">
                                    Total de chamados
                                </Typography>
                                <Box padding={2} display='flex' justifyContent='center' alignItems='center'>
                                {!isLoadingChamado &&(     
                                    <Chart
                                        chartType="ColumnChart"
                                        width="100%"
                                        height="100%"
                                        data={data}
                                        legendToggle={false}
                                    />
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

                    </Grid>
                </Grid>
              
            </Box>
            </Box>
        </LayoutBaseDePagina>
    );
}