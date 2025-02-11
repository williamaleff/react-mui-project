import { useNavigate, useParams } from "react-router-dom";
import { FerramentasDaListagem } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { useEffect, useState } from "react";
import { InternoService } from "../../shared/services/api/interno/InternoService";
import { Box, Button, Card, CardContent, LinearProgress, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, TextField, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { PontoService } from "../../shared/services/api/interno/PontoService";

 export const frequencia: React.FC = () => {
    const { id = "geral" } = useParams<"id">();
    const [month, setMonth] = useState("2025-02");
    const [isIndividual, setIsIndividual] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [nome, setNome] = useState('');
    const [totalHoras, setTotalHoras] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        if(id !== 'geral'){
            setIsIndividual(true);
            InternoService.getById(Number(id)).then((result) => {
      
                if (result instanceof Error) {
                    alert(result.message);
                    navigate('/interno');                    
                } else {
                    const [ano, mes] = month.split('-').map(Number);
                    setNome(result.nome);
                    PontoService.getHorasTrabalhadas(result.id, ano, mes).then((e)=>{
                        setIsLoading(false);
                        if (e instanceof Error) {
                            alert('Erro ao somar as horas trabalhadas \n'+e.message);                    
                        } else {
                            setTotalHoras(e.totalHorasTrabalhadas)
                            console.log(e)
                        }
                    });
                        
                }
            })      
        } else {
            setIsIndividual(false);
        }

    },[id, month]);

    const handleMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMonth(event.target.value);
       
    };

    const handleClickPDF = async () => {
      setIsLoading(true);
      const [ano, mes] = month.split('-').map(Number);
      
      if(id !== 'geral'){
        await PontoService.downloadRegistrosPDFporID(Number(id), ano, mes);
        setIsLoading(false);

      }else {
        await PontoService.downloadRegistrosPDF(ano, mes);
        setIsLoading(false);

      }

    };

    const handleClickExcel = async () => {
      setIsLoading(true);
        const [ano, mes] = month.split('-').map(Number);
        if(id !== 'geral'){
          await PontoService.downloadExcelRegistrosporId(Number(id),ano, mes);
          setIsLoading(false);

        }else{
          await PontoService.downloadExcelRegistros(ano, mes);
          setIsLoading(false);

        }
    };
      

    return (
        <LayoutBaseDePagina
            titulo="Frequência dos internos"
            barraDeFerramentas={
                <FerramentasDaListagem />
            }>

<Box p={3}>
      <Card>
        <CardContent>
         {!isIndividual &&(  
            <Typography variant="h6" gutterBottom>
                FREQUÊNCIA GERAL DOS INTERNOS POR MÊS
            </Typography>
        )}
          {isIndividual &&(
            <Typography variant="h6" gutterBottom>
                FREQUÊNCIA INDIVIDUAL
            </Typography>
          )}

          {/* Filtros */}
          <Box display="flex" flexDirection="column" gap={2} mb={3}>
          
          {/*
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="subtitle1">Mês ou Período?</Typography>
              <Select value={period} onChange={handlePeriodChange}>
                <MenuItem value="month">Por Mês</MenuItem>
                <MenuItem value="period">Por Período</MenuItem>
              </Select>           
            </Box>
            */}

            <Box display="flex" alignItems="center" gap={2}>
                <TextField
                    label="Mês"
                    type="month"
                    value={month}
                    onChange={handleMonthChange}
                    InputLabelProps={{ shrink: true }}
                    disabled={isLoading}
                />
                {/*
                <Button variant="contained" color="error" onClick={() => setMonth("")}>Redefinir</Button>
                <Button variant="contained">Pesquisar</Button>
                */}
            </Box>
          </Box>

          {/* Tabela */}
          {isIndividual &&(                         
          <Box>
            <Typography variant="h6" gutterBottom>
              {nome}
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
                  <TableCell>{month}</TableCell>
                  <TableCell>{totalHoras}</TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                        {isLoading && (
                            <TableRow>
                                <TableCell colSpan={3}>
                                    <LinearProgress variant="indeterminate" />
                                </TableCell>
                            </TableRow>
                        )}
              </TableFooter>      
            </Table>
          </Box>
        )}

            <Box mt={2} display="flex" gap="10px" justifyContent="flex-end">
                <Button 
                    variant="contained" 
                    color="success" 
                    startIcon={<DownloadIcon />}
                    onClick={handleClickPDF}
                    disabled={isLoading}
                >
                    Baixar PDF
              </Button>
              <Button 
                    variant="contained" 
                    color="success" 
                    startIcon={<DownloadIcon />}
                    onClick={handleClickExcel}
                    disabled={isLoading}
                >
                    Baixar Planilha
              </Button>
              {isLoading &&(<LinearProgress variant="indeterminate" />)}
            </Box>
        </CardContent>
      </Card>
    </Box>

        </LayoutBaseDePagina>
    )
 };