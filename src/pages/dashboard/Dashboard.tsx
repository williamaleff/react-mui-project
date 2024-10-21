import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { FerramentasDaListagem} from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { useEffect, useRef, useState } from "react";
import { AgenteService } from "../../shared/services/api/agente/AgenteService";
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

    const [isLoadingAgente, setIsLoadingAgente] = useState(true);
    const [totalCountAgente, setTotalCountAgente] = useState(0);
    const [isLoadingTipos, setIsLoadingTipos] = useState(true);
    const [totalCountTipos, setTotalCountTipos] = useState(0);
    const [isLoadingChamado, setIsLoadingChamado] = useState(true);
    const [totalCountChamado, setTotalCountChamado] = useState(0);
    const hasFetchedData = useRef(false);

    const [data, setData] = useState<(string | number | { role: string })[][]>([
        ["Tipos", "Chamados", { role: "style" }],
    ]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoadingAgente(true);
            setIsLoadingTipos(true);
            setIsLoadingChamado(true);

            try {
                const [agenteResult, tiposResult, chamadoResult] = await Promise.all([
                    AgenteService.getAll(1),
                    TiposService.getAll(1),
                    ChamadoService.getAll(1),
                ]);

                if (!(agenteResult instanceof Error)) {
                    setTotalCountAgente(agenteResult.totalCount);
                } else {
                    alert(agenteResult.message);
                }

                if (tiposResult instanceof Error) {
                    alert(tiposResult.message);
                } else {
                    setTotalCountTipos(tiposResult.totalCount);
                    
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
                setIsLoadingAgente(false);
                setIsLoadingTipos(false);
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
            mostrarBotaoNovo={false} />
        }>
            <Box height='100%'>
            <Box width='100%' display='flex' height='40%'>

                <Grid container margin={2}>
                    <Grid item container spacing={2}>
                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" align="center">
                                    Chamados Pendentes
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
                                        {totalCountTipos}
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
                                        {totalCountAgente}
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
                    </Grid>
                </Grid>

              </Box>
            <Box width='100%' display='flex' height='60%'>
            <Grid container margin={2}>
                    <Grid item container spacing={2}>        

                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Card>
                            <CardContent>
                                <Typography variant="h6" align="center">
                                    Total de chamados
                                </Typography>
                                <Box padding={2} display='flex' justifyContent='center' alignItems='center'>     
                                    <Chart
                                        chartType="ColumnChart"
                                        width="100%"
                                        height="100%"
                                        data={data}
                                        legendToggle={false}
                                    />
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