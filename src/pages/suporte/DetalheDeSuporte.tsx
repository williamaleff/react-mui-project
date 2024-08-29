import { useNavigate, useParams } from "react-router-dom";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { FerramentasDeDetalhe } from "../../shared/components";
import React, { useEffect, useState } from "react";
import { SuporteService } from "../../shared/services/api/suporte/SuporteService";
import { Box, Button, Grid, LinearProgress, Paper, TextField } from "@mui/material";
import { VTextField, VForm, useVForm, IVFormErrors } from "../../shared/forms";
import * as yup from 'yup';
import { VTextArea } from "../../shared/forms/VTextArea";

 import dayjs from 'dayjs';
 import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
 import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
 import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
 import { DatePicker } from '@mui/x-date-pickers/DatePicker';
 //import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import 'dayjs/locale/en-gb';
import { AutoCompleteTipos } from "./components/AutoCompleteTipos";
import { AutoCompletePessoas } from "./components/AutoCompletePessoas";
// import { VTextFieldData } from "../../shared/forms/VTextFieldData";
// import { useField } from "@unform/core";

interface IFormData {
    tipoId: number;
    descricao: string;
    pessoaId: number;
    horario: string;
    data: string;
    chamadoGlpi: string;
}

const formValidationSchema: yup.Schema<IFormData> = yup.object().shape({
    descricao: yup.string().required().min(3),
    tipoId: yup.number().required(),
    pessoaId: yup.number().required(),
    chamadoGlpi: yup.string().min(3).required(),
    data: yup.string().required(),
    horario: yup.string().required(),
});

export const DetalheDeSuporte: React.FC = () =>{
    const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();
    const { id = 'novo' } = useParams<'id'>();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [nome, setNome] = useState('');

    const [data, setData] = useState(dayjs(new Date()));

    const horarioAtual = new Date().toLocaleTimeString();
    const today = dayjs();
    const fullYear =  new Date().getFullYear().toString();
    const month = (new Date().getMonth()+1).toString().padStart(2, '0');
    const day = new Date().getDate().toString().padStart(2, '0');
    //const todayOfTheTime = dayjs(fullYear+'-'+month+'-'+day+'T'+horarioAtual); 

    // const { fieldName, registerField, defaultValue, error, clearError } = useField('horario');

    // const [value, setValue] = useState('');

    // useEffect(() => {
    //     registerField({
    //         name: fieldName,
    //         getValue: () => value,
    //         setValue: (_, newValue) => setValue(newValue)
    //     })
    // },[registerField, fieldName, value]);


    useEffect(() => {
        if (id !== 'novo') {
            setIsLoading(true);
            
            SuporteService.getById(Number(id))
            .then((result) => {
                setIsLoading(false);

                if (result instanceof Error) {
                    alert(result.message);
                    navigate('/suporte');                    
                } else {
                    setNome(result.chamadoGlpi);

                    formRef.current?.setData(result);
                }
            });
            
        } else {
            formRef.current?.setData({
                tipoId: undefined,
                descricao: '',
                pessoaId: undefined,
                horario: horarioAtual,
                data: (day+'/'+month+'/'+fullYear),
                chamadoGlpi: ''

            });
        }
    }, [id]);

    const handleSave = (dados: IFormData) => {

        formValidationSchema
        .validate(dados, { abortEarly: false })
        .then((dadosValidados) => {
            setIsLoading(true);

        if (id === 'novo') {
            SuporteService.create(dadosValidados)
            .then((result) => {
                setIsLoading(false);

                if(result instanceof Error) {
                    alert(result.message);
                } else {
                    if (isSaveAndClose()) {
                        navigate('/suporte');
                    } else {
                        navigate(`/suporte/detalhe/${result}`);
                    }
                }
            })
        } else {
            SuporteService.updateById(Number(id), { id: Number(id), ...dadosValidados})
            .then((result) => {
                setIsLoading(false);
                
                if(result instanceof Error) {
                    alert(result.message);
                } else {
                    if (isSaveAndClose()) {
                        navigate('/suporte');
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
            SuporteService.deleteById(id)
            .then(result => {
                if (result instanceof Error) {
                    alert(result.message);
                } else {
                    alert("Registro apagado com sucesso!")
                    navigate('/suporte');
                }
            });            
        }
    }

    return(
        <LayoutBaseDePagina
        titulo={id === 'novo' ? 'Novo Suporte' : nome}
        barraDeFerramentas={
            <FerramentasDeDetalhe 
                textoBotaoNovo="Novo"
                mostrarBotaoSalvarEFechar
                mostrarBotaoNovo = {id !== 'novo'}
                mostrarBotaoApagar = {id !== 'novo'}

                aoClicarEmSalvar={save}
                aoClicarEmSalvarEFechar={saveAndClose}
                aoClicarEmApagar={() => handleDelete(Number(id))}
                aoClicarEmVoltar={() => navigate('/suporte')}
                aoClicarEmNovo={() => navigate('/suporte/detalhe/novo')}
            />
        }>

            {isLoading && (
                <LinearProgress variant="indeterminate" />
            )}

            <VForm ref={formRef} onSubmit={handleSave} placeholder='Formulário Suporte' onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <Box margin={1} display="flex" flexDirection="column" component={Paper} variant="outlined">

                    <Grid container direction="column" padding={2} spacing={2}>

                    {isLoading && (
                        <Grid item>
                            <LinearProgress variant="indeterminate" />
                        </Grid>
                    )}                        

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                            <VTextArea 
                                disabled={isLoading} 
                                fullWidth 
                                label="Descricao" 
                                name="descricao" 
                                />                
                            </Grid>
                        </Grid>
                       

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                                <AutoCompleteTipos 
                                isExternalLoading={isLoading}
                                />
                                {/* <VTextArea 
                                disabled={isLoading} 
                                fullWidth 
                                label="Tipos" 
                                name="tipo" 
                                />                
                                     */}

                            </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                                <AutoCompletePessoas 
                                isExternalLoading={isLoading}
                                />
                                {/* <VTextArea 
                                disabled={isLoading} 
                                fullWidth 
                                label="Requerente" 
                                name="pessoaId" 
                                />                 */}
                            
                            </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                            <VTextField 
                                onChange={e => setNome(e.target.value)} 
                                disabled={isLoading} 
                                fullWidth 
                                label="Chamado GLPI" 
                                name="chamadoGlpi" 
                                />     
                                </Grid>
                        </Grid>
                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                                <Button>Obter número glpi</Button>
                            </Grid>
                        </Grid>

                        <Grid container item direction='row' spacing={2}>
                           <Grid item xs={12} sm={12} md={6} lg={4} xl={2} >
                           {/* <LocalizationProvider adapterLocale='en-gb' dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            name="data"
                                            defaultValue={today}                                   
                                            label='Data'
                                            disableFuture
                                            views={['day', 'month', 'year']}
                                            value={data}
                                            onChange={e=>{setData(dayjs(e));}}
                                        />
                                 </LocalizationProvider>
                                    <TextField 
                                    name="data"
                                    /> */}
                            <VTextArea 
                                disabled={isLoading} 
                                fullWidth 
                                label="Data" 
                                name="data"
                                type="number" 
                                />                
                             

                           </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                                {/* <LocalizationProvider adapterLocale='en-gb' dateAdapter={AdapterDayjs}>
                                     <DemoContainer
                                         components={[
                                         'TimePicker',
                                         ]}
                                     >
                                
                                 <DemoItem >
                                     <TimePicker
                                     label="Horário"
                                     disabled={isLoading} 
                                     defaultValue={todayOfTheTime} 
                                     disableFuture 
                                     name="horario"

                                    value={dayjs(value)}
                                    //onChange={ e => {setValue(e.)} }
                                     />
                                 </DemoItem>
                                 </DemoContainer>
                                 </LocalizationProvider> */}

                                <VTextArea 
                                disabled={isLoading} 
                                fullWidth 
                                label="Horário" 
                                name="horario"
                                type="number" 
                                />                
                            

                                 </Grid>
                                 </Grid>


                    </Grid>               
                    
                </Box>
            </VForm>

        </LayoutBaseDePagina>
    );
}