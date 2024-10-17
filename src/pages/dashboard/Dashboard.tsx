import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { FerramentasDaListagem} from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { useEffect, useState } from "react";
import { AgenteService } from "../../shared/services/api/agente/AgenteService";
import { ClienteService } from "../../shared/services/api/cliente/ClienteService";
import { ChamadoService } from "../../shared/services/api/chamado/ChamadoService";
import Chart from "react-google-charts";

interface TipoIdCount {
    tipoId: string;
    count: number;
  }

export const Dashboard = () => {

    const [isLoadingAgente, setIsLoadingAgente] = useState(true);
    const [totalCountAgente, setTotalCountAgente] = useState(0);
    const [isLoadingCliente, setIsLoadingCliente] = useState(true);
    const [totalCountCliente, setTotalCountCliente] = useState(0);
    const [isLoadingChamado, setIsLoadingChamado] = useState(true);
    const [totalCountChamado, setTotalCountChamado] = useState(0);
    const [hasFetchedData, setHasFetchedData] = useState(false);

    const [data, setData] = useState<(string | number | { role: string })[][]>([
        ["Tipos", "Chamados", { role: "style" }],
    ]);

    useEffect(() => {
        const fetchData = async () => {
        if (hasFetchedData) return;

        setIsLoadingAgente(true);
        setIsLoadingCliente(true);
        setIsLoadingChamado(true);

    
        AgenteService.getAll(1)
        .then((result) => {
            setIsLoadingAgente(false);

            if (result instanceof Error) {
                alert(result.message);
            } else {
                setTotalCountAgente(result.totalCount);
            }
        });
        
        ClienteService.getAll(1)
        .then((result) => {
            setIsLoadingCliente(false);

            if (result instanceof Error) {
                alert(result.message);
            } else {
                setTotalCountCliente(result.totalCount);
            }
        });

        ChamadoService.getAll(1)
        .then((result) => {
            setIsLoadingChamado(false);

            if (result instanceof Error) {
                alert(result.message);
            } else {

                const tipoIdCounts = result.data.reduce<Record<string, number>>((acc, item) => {
                    acc[item.tipoId] = (acc[item.tipoId] || 0) + 1;
                    return acc;
                  }, {});

                  const uniqueTipoIdCounts: TipoIdCount[] = Object.entries(tipoIdCounts).map(([tipoId, count]) => ({
                    tipoId,
                    count
                  }));

                  console.log(uniqueTipoIdCounts); // Para depuração
                  const chartData = uniqueTipoIdCounts.map((item) => [item.tipoId, item.count, 'blue']);
                console.log(data[0][0])
                setData((prevData)=>[...prevData, ...chartData]);
                setTotalCountChamado(result.totalCount);
                setHasFetchedData(true);
                console.log(data[0])
            }
        });
    }

    fetchData();

    },[])


    return (
        <LayoutBaseDePagina 
        titulo="Página Inicial" 
        barraDeFerramentas={
        <FerramentasDaListagem
            mostrarBotaoNovo={false} />
        }>
            <Box width='100%' display='flex'>

                <Grid container margin={2}>
                    <Grid item container spacing={2}>
                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" align="center">
                                    Chamados Pendentes
                                </Typography>
                                <Box padding={6} display='flex' justifyContent='center' alignItems='center'>
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
                                    Clientes
                                </Typography>
                                <Box padding={6} display='flex' justifyContent='center' alignItems='center'>
                                {!isLoadingCliente &&(
                                    <Typography variant="h3">
                                        {totalCountCliente}
                                    </Typography>
                                    )}
                                    {isLoadingCliente &&(
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
                                    Funcionários
                                </Typography>
                                <Box padding={6} display='flex' justifyContent='center' alignItems='center'>
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
                                    Chamados
                                </Typography>
                                <Box padding={6} display='flex' justifyContent='center' alignItems='center'>
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
            <Box width='100%' display='flex'>
            <Grid container margin={2}>
                    <Grid item container spacing={2}>        

                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Card>
                            <CardContent>
                            <Typography variant="h5" align="center">
                                        Total de chamados
                                    </Typography>

                                    <Box padding={6} display='flex' justifyContent='center' alignItems='center'>
                                 
                        <Chart
                        chartType="ColumnChart"
                        width="120%"
                        height="100%"
                        data={data}
                        />
                        </Box>
                         </CardContent>
                            </Card>
                        </Grid>

                    </Grid>
                </Grid>
              
            </Box>
        </LayoutBaseDePagina>
    );
}