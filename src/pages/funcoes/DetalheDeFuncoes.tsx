import { useNavigate, useParams } from "react-router-dom";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { FerramentasDeDetalhe } from "../../shared/components";
import { useEffect, useState } from "react";
import { FuncoesService } from "../../shared/services/api/funcoes/FuncoesService";
import { Box, Grid, LinearProgress, Paper, Typography } from "@mui/material";
import { VTextField, VForm, useVForm, IVFormErrors } from "../../shared/forms";
import * as yup from 'yup';

interface IFormData {
    nome: string;
}

const formValidationSchema: yup.Schema<IFormData> = yup.object().shape({
    nome: yup.string().required().min(3),
});

export const DetalheDeFuncoes: React.FC = () =>{
    const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();
    const { id = 'nova' } = useParams<'id'>();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [nome, setNome] = useState('');

    useEffect(() => {
        if (id !== 'nova') {
            setIsLoading(true);
            
            FuncoesService.getById(Number(id))
            .then((result) => {
                setIsLoading(false);

                if (result instanceof Error) {
                    alert(result.message);
                    navigate('/funcoes');                    
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
            FuncoesService.create(dadosValidados)
            .then((result) => {
                setIsLoading(false);

                if(result instanceof Error) {
                    alert(result.message);
                } else {
                    if (isSaveAndClose()) {
                        navigate('/funcoes');
                    } else {
                        navigate(`/funcoes/detalhe/${result}`);
                    }
                }
            })
        } else {
            FuncoesService.updateById(Number(id), { id: Number(id), ...dadosValidados})
            .then((result) => {
                setIsLoading(false);
                
                if(result instanceof Error) {
                    alert(result.message);
                } else {
                    if (isSaveAndClose()) {
                        navigate('/funcoes');
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
            FuncoesService.deleteById(id)
            .then(result => {
                if (result instanceof Error) {
                    alert(result.message);
                } else {
                    alert("Registro apagado com sucesso!")
                    navigate('/funcoes');
                }
            });            
        }
    }

    return(
        <LayoutBaseDePagina
        titulo={id === 'nova' ? 'Nova Funcao' : nome}
        barraDeFerramentas={
            <FerramentasDeDetalhe 
                textoBotaoNovo="Nova"
                mostrarBotaoSalvarEFechar
                mostrarBotaoNovo = {id !== 'nova'}
                mostrarBotaoApagar = {id !== 'nova'}

                aoClicarEmSalvar={save}
                aoClicarEmSalvarEFechar={saveAndClose}
                aoClicarEmApagar={() => handleDelete(Number(id))}
                aoClicarEmVoltar={() => navigate('/funcoes')}
                aoClicarEmNovo={() => navigate('/funcoes/detalhe/nova')}
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