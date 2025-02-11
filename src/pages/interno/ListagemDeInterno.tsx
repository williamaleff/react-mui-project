import { useNavigate, useSearchParams } from "react-router-dom";
import { FerramentasDaListagem } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { useEffect, useMemo, useState } from "react";
import { IListagemInterno, InternoService } from "../../shared/services/api/interno/InternoService";
import { useDebounce } from "../../shared/hooks";
import { Icon, IconButton, LinearProgress, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from "@mui/material";
import { Environment } from "../../shared/environment";

 export const ListagemDeInterno: React.FC = () => {

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
                const accessToken = localStorage.getItem('APP_ACCESS_TOKEN');
                if (accessToken) {
                    // Remove o token
                    localStorage.removeItem('APP_ACCESS_TOKEN');
                    console.log('Token removido com sucesso.');
                    window.location.reload();
                } else {
                    console.log('Nenhum token encontrado.');
                }
                
            } else {
                console.log(result);

                setTotalCount(result.totalCount);
                setRows(result.data);
            }
        });
        });
    },[busca, pagina])

    const handleDelete = (id: number) => {
        if (confirm('Realmente deseja apagar?')) {
            InternoService.deleteById(id)
            .then(result => {
                if(result instanceof Error) {
                    alert(result.message);
                } else {
                    setRows(oldRows => [
                        ...oldRows.filter(oldRow => oldRow.id !== id)
                    ]);
                    alert('Registro apagado com sucesso!');
                }
            });
        }
    };

    return (
        <LayoutBaseDePagina
            titulo="Listagem de interno"
            barraDeFerramentas={
                <FerramentasDaListagem
                mostrarInputBusca 
                mostrarBotaoNovo
                textoBotaoNovo="Novo"
                aoClicarEmNovo={() => navigate('/interno/detalhe/novo')}
                textoDaBusca={busca}
                aoMudarTextoDeBusca={texto => setSearchParams({ busca: texto, pagina: '1' }, { replace: true })}
                />
            }>

            <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: 'auto'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell width={120}>Ações</TableCell>
                            <TableCell>Função</TableCell>
                            <TableCell>Nome</TableCell>
                            <TableCell>Localização</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        
                        {rows.map(row => (
                            <TableRow key={row.id}>
                                <TableCell>
                                    <IconButton size="small" onClick={() => handleDelete(row.id)}>
                                        <Icon>delete</Icon>
                                    </IconButton>
                                    <IconButton size="small" onClick={() => navigate(`/interno/detalhe/${row.id}`)}>
                                        <Icon>edit</Icon>
                                    </IconButton>
                                    <IconButton size="small" onClick={() => navigate(`/frequencia/${row.id}`)}>
                                        <Icon>schedule</Icon>
                                    </IconButton>
                                </TableCell>
                                <TableCell>{row.funcao}</TableCell>
                                <TableCell>{row.nome}</TableCell>
                                <TableCell>{row.localizacao}</TableCell>
                            </TableRow>
                        ))}

                    </TableBody>

                        {totalCount === 0 && !isLoading &&(
                            <caption>{Environment.LISTAGEM_VAZIA}</caption>
                        )}

                    <TableFooter>
                        {isLoading && (
                            <TableRow>
                                <TableCell colSpan={3}>
                                    <LinearProgress variant="indeterminate" />
                                </TableCell>
                            </TableRow>
                        )}
                        {(totalCount > 0 && totalCount > Environment.LIMITE_DE_LINHAS) && (
                            <TableRow>
                                <TableCell colSpan={3}>
                                    <Pagination
                                    page={pagina} 
                                    count={Math.ceil(totalCount/Environment.LIMITE_DE_LINHAS)} 
                                    onChange={(_, newPage) => setSearchParams({ busca, pagina: newPage.toString() },{ replace: true })} />
                                </TableCell>
                            </TableRow>
                        )}

                    </TableFooter>
                </Table>
            </TableContainer>

        </LayoutBaseDePagina>
    )
 };