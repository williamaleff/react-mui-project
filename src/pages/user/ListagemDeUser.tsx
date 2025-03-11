import { useNavigate, useSearchParams } from "react-router-dom";
import { FerramentasDaListagem } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import React, { useEffect, useMemo, useState } from "react";
import { IListagemUser, UserService } from "../../shared/services/api/user/UserService";
import { useDebounce } from "../../shared/hooks";
import { Icon, IconButton, LinearProgress, Pagination, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from "@mui/material";
import { Environment } from "../../shared/environment";
import { Alert } from "../../shared/forms/Alert";
  
 export const ListagemDeUser: React.FC = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const { debounce } = useDebounce();
    const navigate = useNavigate();

    const [rows, setRows] = useState<IListagemUser[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

   // Estados para a mensagem de erro e controle do Snackbar
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

    const busca = useMemo(()=>{
        return searchParams.get('busca') || '';
    },[searchParams]);

    const pagina = useMemo(()=>{
        return Number(searchParams.get('pagina') || '1');
    },[searchParams]);

    useEffect(() => {
        setIsLoading(true);

        debounce(() => {
            UserService.getAll(pagina, busca)
        .then((result) => {
            setIsLoading(false);

            if (result instanceof Error) {
                setErrorMessage(result.message);
                setOpenError(true);
                navigate('/interno');
            } else {
                setTotalCount(result.totalCount);
                setRows(result.data);
            }
        });
        });
    },[busca, pagina])

    const handleDelete = (id: string) => {
        if (confirm('Realmente deseja apagar?')) {
            UserService.deleteById(id)
            .then(result => {
                if(result instanceof Error) {
                    setErrorMessage(result.message);
                    setOpenError(true);
                } else {
                    setRows(oldRows => [
                        ...oldRows.filter(oldRow => oldRow.id !== id)
                    ]);
                    setErrorMessage('Registro apagado com sucesso!');
                    setOpenError(true);
                }
            });
        }
    };

    return (
        <LayoutBaseDePagina
            titulo="Listagem de user"
            barraDeFerramentas={
                <FerramentasDaListagem
                mostrarInputBusca 
                mostrarBotaoNovo
                textoBotaoNovo="Novo"
                aoClicarEmNovo={() => navigate('/user/detalhe/novo')}
                textoDaBusca={busca}
                aoMudarTextoDeBusca={texto => setSearchParams({ busca: texto, pagina: '1' }, { replace: true })}
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
            <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: 'auto'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell width={120}>Ações</TableCell>
                            <TableCell>Login</TableCell>
                            <TableCell>Acesso</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        
                        {rows.map(row => (
                            <TableRow key={row.id}>
                                <TableCell>
                                    <IconButton size="small" onClick={() => handleDelete(row.id)}>
                                        <Icon>delete</Icon>
                                    </IconButton>
                                    <IconButton size="small" onClick={() => navigate(`/user/detalhe/${row.id}`)}>
                                        <Icon>edit</Icon>
                                    </IconButton>
                                </TableCell>
                                <TableCell>{row.login}</TableCell>
                                <TableCell>{row.role}</TableCell>
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