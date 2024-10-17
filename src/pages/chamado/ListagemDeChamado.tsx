import { useNavigate, useSearchParams } from "react-router-dom";
import { FerramentasDaListagem } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { useEffect, useMemo, useState } from "react";
import { IListagemChamado, ChamadoService } from "../../shared/services/api/chamado/ChamadoService";
import { useDebounce } from "../../shared/hooks";
import { Icon, IconButton, LinearProgress, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from "@mui/material";
import { Environment } from "../../shared/environment";

 export const ListagemDeChamado: React.FC = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const { debounce } = useDebounce();
    const navigate = useNavigate();

    const [rows, setRows] = useState<IListagemChamado[]>([]);
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
            ChamadoService.getAll(pagina, busca)
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

    const handleDelete = (id: number) => {
        if (confirm('Realmente deseja apagar?')) {
            ChamadoService.deleteById(id)
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
            titulo="Listagem de chamado"
            barraDeFerramentas={
                <FerramentasDaListagem
                mostrarInputBusca 
                textoBotaoNovo="Novo"
                aoClicarEmNovo={() => navigate('/chamado/detalhe/novo')}
                textoDaBusca={busca}
                aoMudarTextoDeBusca={texto => setSearchParams({ busca: texto, pagina: '1' }, { replace: true })}
                />
            }>

            <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: 'auto'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell width={100}>Ações</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Descricao</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        
                        {rows.map(row => (
                            <TableRow key={row.id}>
                                <TableCell>
                                    <IconButton size="small" onClick={() => handleDelete(row.id)}>
                                        <Icon>delete</Icon>
                                    </IconButton>
                                    <IconButton size="small" onClick={() => navigate(`/chamado/detalhe/${row.id}`)}>
                                        <Icon>edit</Icon>
                                    </IconButton>
                                </TableCell>
                                <TableCell>{row.tipoId}</TableCell>
                                <TableCell>{row.descricao}</TableCell>
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