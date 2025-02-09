import { useNavigate, useSearchParams } from "react-router-dom";
import { FerramentasDaListagem } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { useEffect, useMemo, useState } from "react";
import { IListagemInterno, InternoService } from "../../shared/services/api/interno/InternoService";
import { useDebounce } from "../../shared/hooks";
import { Box, Button, Card, CardContent, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { SelectChangeEvent } from "@mui/material/Select";

 export const frequencia: React.FC = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const { debounce } = useDebounce();
    const navigate = useNavigate();

    const [rows, setRows] = useState<IListagemInterno[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const busca = useMemo(()=>{
        return searchParams.get('busca') || '';
    },[searchParams]);

    const pagina = useMemo(()=>{
        return Number(searchParams.get('pagina') || '1');
    },[searchParams]);

    useEffect(() => {
        setIsLoading(true);

        debounce(() => {
            InternoService.getAll(pagina, busca)
        .then((result) => {
            setIsLoading(false);

            if (result instanceof Error) {
                alert(result.message);
            } else {
                console.log(result);

                setTotalCount(result.totalCount);
                setRows(result.data);
            }
        });
        });
    },[busca, pagina])

    const [period, setPeriod] = useState("month");
    const [month, setMonth] = useState("2025-02");

    const handlePeriodChange = (event: SelectChangeEvent<string>) => {
        setPeriod(event.target.value as string);
    };

    const handleMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMonth(event.target.value);
    };

    return (
        <LayoutBaseDePagina
            titulo="Frequência dos internos"
            barraDeFerramentas={
                <FerramentasDaListagem
                textoBotaoNovo="Novo"
                aoClicarEmNovo={() => navigate('/interno/detalhe/novo')}
                textoDaBusca={busca}
                aoMudarTextoDeBusca={texto => setSearchParams({ busca: texto, pagina: '1' }, { replace: true })}
                />
            }>

<Box p={3}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            FREQUÊNCIA GERAL
          </Typography>

          {/* Filtros */}
          <Box display="flex" flexDirection="column" gap={2} mb={3}>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="subtitle1">Mês ou Período?</Typography>
              <Select value={period} onChange={handlePeriodChange}>
                <MenuItem value="month">Por Mês</MenuItem>
                <MenuItem value="period">Por Período</MenuItem>
              </Select>
            </Box>

            <Box display="flex" alignItems="center" gap={2}>
              <TextField
                label="Mês"
                type="month"
                value={month}
                onChange={handleMonthChange}
                InputLabelProps={{ shrink: true }}
              />
              <Button variant="contained" color="error" onClick={() => setMonth("")}>Redefinir</Button>
              <Button variant="contained">Pesquisar</Button>
            </Box>
          </Box>

          {/* Tabela */}
          <Box>
            <Typography variant="h6" gutterBottom>
              WILLIAM ALEFE LUCAS TEIXEIRA
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ backgroundColor: "#d1e7dd" }}>Mês</TableCell>
                  <TableCell style={{ backgroundColor: "#d1e7dd" }}>Total de Horas Trabalhadas</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>FEVEREIRO/2025</TableCell>
                  <TableCell>028:48:04</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button variant="contained" color="success" startIcon={<DownloadIcon />}>
                Baixar
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>

        </LayoutBaseDePagina>
    )
 };