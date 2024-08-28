import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { FerramentasDaListagem} from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { useEffect, useState } from "react";
import { CidadesService } from "../../shared/services/api/cidades/CidadesService";
import { PessoasService } from "../../shared/services/api/pessoas/PessoasService";
import { SuporteService } from "../../shared/services/api/suporte/SuporteService";

export const Dashboard = () => {

    const [isLoadingCidades, setIsLoadingCidades] = useState(true);
    const [totalCountCidades, setTotalCountCidades] = useState(0);
    const [isLoadingPessoas, setIsLoadingPessoas] = useState(true);
    const [totalCountPessoas, setTotalCountPessoas] = useState(0);
    const [isLoadingSuportes, setIsLoadingSuportes] = useState(true);
    const [totalCountSuportes, setTotalCountSuportes] = useState(0);


    useEffect(() => {
        setIsLoadingCidades(true);
        setIsLoadingPessoas(true);
        setIsLoadingSuportes(true);

    
        CidadesService.getAll(1)
        .then((result) => {
            setIsLoadingCidades(false);

            if (result instanceof Error) {
                alert(result.message);
            } else {
                setTotalCountCidades(result.totalCount);
            }
        });
        
        PessoasService.getAll(1)
        .then((result) => {
            setIsLoadingPessoas(false);

            if (result instanceof Error) {
                alert(result.message);
            } else {
                setTotalCountPessoas(result.totalCount);
            }
        });

        SuporteService.getAll(1)
        .then((result) => {
            setIsLoadingSuportes(false);

            if (result instanceof Error) {
                alert(result.message);
            } else {
                setTotalCountSuportes(result.totalCount);
            }
        });
        
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

                        <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5" align="center">
                                        Total de pessoas
                                    </Typography>

                                    <Box padding={6} display='flex' justifyContent='center' alignItems='center'>
                                    {!isLoadingPessoas &&(
                                    <Typography variant="h1">
                                        {totalCountPessoas}
                                    </Typography>
                                    )}
                                    {isLoadingPessoas &&(
                                    <Typography variant="h6">
                                        Carregando...
                                    </Typography>
                                    )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
                            <Card>
                            <CardContent>
                                    <Typography variant="h5" align="center">
                                        Total de cidades
                                    </Typography>

                                    <Box padding={6} display='flex' justifyContent='center' alignItems='center'>
                                    {!isLoadingCidades &&(
                                    <Typography variant="h1">
                                        {totalCountCidades}
                                    </Typography>
                                    )}
                                    {isLoadingCidades &&(
                                    <Typography variant="h6">
                                        Carregando...
                                    </Typography>
                                    )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
                            <Card>
                            <CardContent>
                                    <Typography variant="h5" align="center">
                                        Total de suportes
                                    </Typography>

                                    <Box padding={6} display='flex' justifyContent='center' alignItems='center'>
                                    {!isLoadingSuportes &&(
                                    <Typography variant="h1">
                                        {totalCountSuportes}
                                    </Typography>
                                    )}
                                    {isLoadingSuportes &&(
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
        </LayoutBaseDePagina>
    );
}