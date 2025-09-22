import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { FerramentasDaListagem } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { useEffect, useMemo, useState } from "react";
import { IDetalheInterno, InternoService } from "../../shared/services/api/interno/InternoService";
import { Autocomplete, Avatar, Box, Button, Card, CardContent, CircularProgress, Collapse, Container, Grid, IconButton, LinearProgress, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, TextField, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { PontoService, TgetRegistrosFuncionarioMes } from "../../shared/services/api/interno/PontoService";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { UploadService } from "../../shared/services/api/interno/UploadService";
import { Alert } from "../../shared/forms/Alert";
import { CandidatosService } from "../../shared/services/api/candidatos/CandidatosService";

export const Frequencia: React.FC = () => {
  const { id = "geral" } = useParams<"id">();
  const dataAtual = new Date();
  const ano = dataAtual.getFullYear();
  const mes = (dataAtual.getMonth() + 1).toString().padStart(2, '0'); // padStart adiciona o zero à esquerda, se necessário
  const dataFormatada = `${ano}-${mes}`;
  const [month, setMonth] = useState(dataFormatada);
  const [monthExtenso, setMonthExtenso] = useState(dataFormatada);
  const [isIndividual, setIsIndividual] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [nome, setNome] = useState('');
  const [totalHoras, setTotalHoras] = useState('');
  const [registros, setRegistros] = useState<TgetRegistrosFuncionarioMes>([]);
  const [foto, setFoto] = useState('')
  const [detalhes, setDetalhes] = useState<IDetalheInterno>()

  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openError, setOpenError] = useState(false);

  const [funcoes, setFuncoes] = useState<string[]>([]);
  const [selectedFuncao, setSelectedFuncao] = useState<string>('TODOS');

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenError(false);
  };

  function formatDuration(duration: string): string {
    // Utiliza uma expressão regular para capturar horas, minutos e segundos
    const matches = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?/);
    if (!matches) return "00:00:00";

    const hours = parseInt(matches[1] || "0", 10);
    const minutes = parseInt(matches[2] || "0", 10);
    const seconds = parseFloat(matches[3] || "0");

    const totalSeconds = Math.floor(hours * 3600 + minutes * 60 + seconds);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    // Formata cada parte com 2 dígitos
    const hStr = String(h).padStart(2, "0");
    const mStr = String(m).padStart(2, "0");
    const sStr = String(s).padStart(2, "0");

    return `${hStr}:${mStr}:${sStr}`;
  }

  useEffect(() => {

    if (id !== 'geral') {
      setIsLoading(true)
      setIsIndividual(true);
      InternoService.getById(Number(id)).then((result) => {
        if (result instanceof Error) {
          setErrorMessage(result.message);
          setOpenError(true);
          navigate('/interno');
        } else {
          const [ano, mes] = month.split('-').map(Number);
          setNome(result.nome);
          setDetalhes(result);
          PontoService.getRegistrosFuncionarioMes(result.id, ano, mes).then((resultado) => {
            if (!(resultado instanceof Error)) {
              setRegistros(resultado);
            } else {
              setErrorMessage(resultado.message);
              setOpenError(true);
            }
          });

          PontoService.getHorasTrabalhadas(result.id, ano, mes).then((e) => {
            setIsLoading(false);
            if (e instanceof Error) {
              setErrorMessage('Erro ao somar as horas trabalhadas \n' + e.message);
              setOpenError(true);
            } else {
              setTotalHoras(e.totalHorasTrabalhadas)
              // Separa o ano e o mês
              const [ano, mes] = month.split('-');

              // Array com os meses em extenso (todos em maiúsculas)
              const meses = [
                "JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO",
                "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"
              ];

              // Converte o mês para número, subtrai 1 para obter o índice correto do array
              const mesExtenso = meses[parseInt(mes, 10) - 1];

              // Monta a string no formato desejado
              setMonthExtenso(`${mesExtenso}/${ano}`);

            }
          });

          UploadService.getByfile(result.foto).then(async (data) => {
            if (data instanceof Error) {
              setErrorMessage(data.message);
              setOpenError(true);
            } else {
              const imageUrlPreview = URL.createObjectURL(data);
              setFoto(imageUrlPreview)
            }
          })

        }
      })
    } else {
      setIsIndividual(false);
    }


  }, [id, month]);

  useEffect(() => {
    CandidatosService.getCandidatosFuncoes().then((funcoes) => {
      if (funcoes instanceof Error) {
        setErrorMessage(funcoes.message);
        setOpenError(true);
      } else {
        const funcoesFiltradas = Array.from(new Set(funcoes.filter(f => f && f.trim() !== '')));
        setFuncoes(['TODOS', ...funcoesFiltradas]);
      }

    });
  }, []);

  const handleMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMonth(event.target.value);

  };

  const handleClickPDF: () => Promise<void> = async () => {
    setIsLoading(true);
    const [ano, mes] = month.split('-').map(Number);
    const funcao = selectedFuncao;

    if (id !== 'geral') {
      await PontoService.downloadRegistrosPDFporID(Number(id), ano, mes).then((ex) => {
        if (ex instanceof Error) {
          setErrorMessage(ex.message);
          setOpenError(true);
        }

      });
      setIsLoading(false);

    } else {
      await PontoService.downloadRegistrosPDF(funcao, ano, mes).then((e) => {
        if (e instanceof Error) {
          setErrorMessage(e.message);
          setOpenError(true);
        }

      });
      setIsLoading(false);

    }

  };

  const handleClickExcel = async () => {
    setIsLoading(true);
    const [ano, mes] = month.split('-').map(Number);
    if (id !== 'geral') {
      await PontoService.downloadExcelRegistrosporId(Number(id), ano, mes);
      setIsLoading(false);

    } else if (selectedFuncao && selectedFuncao !== 'TODOS') {
      // Quando função está definida e não é TODOS
      await PontoService.downloadExcelRegistros(selectedFuncao, ano, mes);
      setIsLoading(false);
    } else {
      await PontoService.downloadExcelRegistros(null, ano, mes);
      setIsLoading(false);
    }
  };

  const [open, setOpen] = useState(false);

  const toggleTable = () => {
    setOpen(!open);
  };
  // Extrai o ano e o mês
  const [yearStr, monthStr] = month.split('-');
  const year = parseInt(yearStr, 10);
  const monthNumber = parseInt(monthStr, 10);

  // Calcula o número de dias no mês
  // new Date(year, monthNumber, 0) retorna o último dia do mês anterior ao que está no parâmetro "monthNumber".
  // Como monthNumber é 2 para "2025-02", teremos o último dia de fevereiro.
  const daysInMonth = new Date(year, monthNumber, 0).getDate();

  // Cria um array de dias, de 1 até daysInMonth
  const daysArray = Array.from({ length: daysInMonth }, (_, index) => index + 1);

  const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const [searchParams, setSearchParams] = useSearchParams();

  const buscaFrequencia = useMemo(() => {
    return searchParams.get('busca') || '';
  }, [searchParams]);

  return (
    <LayoutBaseDePagina
      titulo="Frequência dos internos"
      barraDeFerramentas={
        <FerramentasDaListagem
          mostrarInputBuscaFrequencia
          textoDaBuscaFrequencia={buscaFrequencia}
          aoMudarTextoDeBuscaFrequencia={texto =>
            setSearchParams({ busca: texto, pagina: '1' }, { replace: true })
          }
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


      <Box p={3}>
        <Card>
          <CardContent>
            {!isIndividual && (
              <Typography variant="h6" gutterBottom>
                FREQUÊNCIA GERAL DOS INTERNOS POR MÊS
              </Typography>
            )}
            {isIndividual && (
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
                  sx={{ width: 300 }} // largura fixa para o campo Mês
                />
                {/*
                <Button variant="contained" color="error" onClick={() => setMonth("")}>Redefinir</Button>
                <Button variant="contained">Pesquisar</Button>
                */}
                {!isIndividual && (
                  <Autocomplete
                    freeSolo
                    options={funcoes}
                    value={selectedFuncao}
                    onChange={(_event, newValue) => {
                      // Se newValue for nulo, mantém "Todos"
                      setSelectedFuncao(newValue || 'TODOS');
                    }}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : '')}
                    renderInput={(params) => (
                      <TextField {...params} label="Função" variant="outlined" />
                    )}
                    style={{ width: 300 }}
                  />
                )}
              </Box>
            </Box>
            {isLoading && (<LinearProgress variant="indeterminate" />)}
            <Box mt={2} display="flex" gap="10px" justifyContent="flex-end" marginBottom={2} sx={{ pr: 4 }}>
              <Button
                variant="contained"
                color="success"
                onClick={handleClickPDF}
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} /> : <DownloadIcon />}
              >
                {isLoading ? "Carregando..." : "Baixar PDF"}
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleClickExcel}
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} /> : <DownloadIcon />}
              >
                {isLoading ? "Carregando..." : "Baixar Planilha"}
              </Button>
            </Box>

            {/* Tabela */}
            {isIndividual && (
              <Container>
                <Box>
                  <Card className="max-w-2xl mx-auto mt-8 p-4 shadow-lg rounded-2xl">
                    <CardContent>
                      <Grid container spacing={2} alignItems="center" direction={{ xs: 'column', sm: 'row' }}>
                        <Grid item>
                          <Avatar
                            src={foto || ""}
                            alt={nome}
                            sx={{ width: 100, height: 100, borderRadius: '8px' }}
                          />
                        </Grid>
                        <Grid item>
                          <Typography variant="h5" fontWeight="bold" gutterBottom>
                            {nome}
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            <strong>Prontuário:</strong> {detalhes?.prontuario}
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            <strong>Cargo:</strong> {detalhes?.funcao}
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            <strong>Mãe:</strong> {detalhes?.mae}
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            <strong>Localização:</strong> {detalhes?.localizacao}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>

                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          style={{ backgroundColor: "#d1e7dd" }}>

                        </TableCell>
                        <TableCell
                          style={{ backgroundColor: "#d1e7dd" }}>
                          Mês
                        </TableCell>
                        <TableCell
                          style={{ backgroundColor: "#d1e7dd" }}>
                          Total de Horas Trabalhadas
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <IconButton onClick={toggleTable}>
                            {open ? <ExpandLess /> : <ExpandMore />}
                          </IconButton></TableCell>
                        <TableCell>{monthExtenso}</TableCell>
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
                <Collapse in={open}>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Dia</TableCell>
                          <TableCell>Dia da Semana</TableCell>
                          <TableCell>Registro de Frequência</TableCell>
                          <TableCell>Horas Trabalhadas</TableCell>
                          <TableCell>Observação</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {daysArray.map((day) => {
                          const dataAtual = new Date(year, monthNumber - 1, day);
                          const diaAbreviado = diasSemana[dataAtual.getDay()];

                          const formattedDate = dataAtual.toISOString().slice(0, 10);

                          // Procura no array de registros o que tenha o mesmo dia
                          const registro = registros.find((r) => r.dia === formattedDate);

                          // Prepara a string com os horários, caso o registro exista; senão, exibe uma mensagem padrão
                          const horarios = registro
                            ? [
                              registro.entrada.split('.')[0],
                              registro.saidaAlmoco ? registro.saidaAlmoco.split('.')[0] : null,
                              registro.retornoAlmoco ? registro.retornoAlmoco.split('.')[0] : null,
                              registro.saida ? registro.saida.split('.')[0] : null,
                            ]
                              .filter((item) => item !== null && item !== undefined)
                              .join(" | ")
                            : "Sem registro";

                          return (
                            <TableRow key={day}>
                              <TableCell>{day}</TableCell>
                              <TableCell>{diaAbreviado}</TableCell>
                              <TableCell>{horarios}</TableCell>
                              <TableCell>{registro?.horasTrabalhadas ? formatDuration(registro.horasTrabalhadas) : ""}</TableCell>
                              <TableCell>{registro?.observacao || ""}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Collapse>
              </Container>
            )}

          </CardContent>
        </Card>
      </Box>

    </LayoutBaseDePagina>
  )
};