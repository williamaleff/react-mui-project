import { useNavigate, useParams } from "react-router-dom";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { FerramentasDeDetalhe } from "../../shared/components";
import { useEffect, useState } from "react";
import { TiposService } from "../../shared/services/api/tipos/TiposService";
import { Box, Grid, LinearProgress, Paper, Typography } from "@mui/material";
import { VTextField, VForm, useVForm, IVFormErrors } from "../../shared/forms";
import * as yup from 'yup';

interface IFormData {
    nome: string;
}

const formValidationSchema: yup.Schema<IFormData> = yup.object().shape({
    nome: yup.string().required().min(3),
});

export const DetalheDeTipos: React.FC = () =>{
    const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();
    const { id = 'nova' } = useParams<'id'>();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [nome, setNome] = useState('');

    useEffect(() => {
        if (id !== 'nova') {
            setIsLoading(true);
            
            TiposService.getById(Number(id))
            .then((result) => {
                setIsLoading(false);

                if (result instanceof Error) {
                    alert(result.message);
                    navigate('/tipos');                    
                } else {
                    setNome(result.nome);

                    formRef.current?.setData(result);
                }
            });
            
        } else {
            formRef.current?.setData({
                nome: '',
            });
        }
    }, [id]);

    const handleSave = (dados: IFormData) => {

        formValidationSchema
        .validate(dados, { abortEarly: false })
        .then((dadosValidados) => {
            setIsLoading(true);

        if (id === 'nova') {
            TiposService.create(dadosValidados)
            .then((result) => {
                setIsLoading(false);

                if(result instanceof Error) {
                    alert(result.message);
                } else {
                    if (isSaveAndClose()) {
                        navigate('/tipos');
                    } else {
                        navigate(`/tipos/detalhe/${result}`);
                    }
                }
            })
        } else {
            TiposService.updateById(Number(id), { id: Number(id), ...dadosValidados})
            .then((result) => {
                setIsLoading(false);
                
                if(result instanceof Error) {
                    alert(result.message);
                } else {
                    if (isSaveAndClose()) {
                        navigate('/tipos');
                    }
                } 
            });
        }
        }).catch((errors: yup.ValidationError) => {
            const validationErrors: IVFormErrors = {};

            errors.inner.forEach(error => {
                if (!error.path) return;
                
                validationErrors[error.path] = error.message;                
            });
            formRef.current?.setErrors(validationErrors);
        });
    }

    const handleDelete = (id: number) => {
        if (confirm('Realmente deseja apagar?')) {
            TiposService.deleteById(id)
            .then(result => {
                if (result instanceof Error) {
                    alert(result.message);
                } else {
                    alert("Registro apagado com sucesso!")
                    navigate('/tipos');
                }
            });            
        }
    }

    return(
        <LayoutBaseDePagina
        titulo={id === 'nova' ? 'Novo Tipo' : nome}
        barraDeFerramentas={
            <FerramentasDeDetalhe 
                textoBotaoNovo="Nova"
                mostrarBotaoSalvarEFechar
                mostrarBotaoNovo = {id !== 'nova'}
                mostrarBotaoApagar = {id !== 'nova'}

                aoClicarEmSalvar={save}
                aoClicarEmSalvarEFechar={saveAndClose}
                aoClicarEmApagar={() => handleDelete(Number(id))}
                aoClicarEmVoltar={() => navigate('/tipos')}
                aoClicarEmNovo={() => navigate('/tipos/detalhe/nova')}
            />
        }>

            {isLoading && (
                <LinearProgress variant="indeterminate" />
            )}

            <VForm 
                ref={formRef} 
                onSubmit={handleSave}
                placeholder={undefined} 
                onPointerEnterCapture={undefined} 
                onPointerLeaveCapture={undefined}
                >
                <Box margin={1} display="flex" flexDirection="column" component={Paper} variant="outlined">

                    <Grid container direction="column" padding={2} spacing={2}>

                    {isLoading && (
                        <Grid item>
                            <LinearProgress variant="indeterminate" />
                        </Grid>
                    )}

                        <Grid item>
                           <Typography variant="h6">Geral</Typography> 
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={2} >
                            <VTextField onChange={e => setNome(e.target.value)} disabled={isLoading} fullWidth label="Nome" name="nome" />     
                            </Grid>
                        </Grid>
                       
                    </Grid>               
                    
                </Box>
            </VForm>

        </LayoutBaseDePagina>
    );
}