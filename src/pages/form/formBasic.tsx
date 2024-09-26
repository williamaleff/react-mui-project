import { LayoutBaseDePagina } from "../../shared/layouts";
import { FerramentasDeDetalhe } from "../../shared/components";
import { Autocomplete, Box, CircularProgress, Grid, LinearProgress, Paper, TextField } from "@mui/material";
import { Controller, useForm } from 'react-hook-form' 
import { PatternFormat } from "react-number-format";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from 'yup';
import { IVFormErrors } from "../../shared/forms";
import { FuncoesService } from "../../shared/services/api/funcoes/FuncoesService";

type TFormData = {
    nome: string,
    email: string,
    funcaoId: number,
    dataContratacao: string,
    dataCriacao?: string,
    telefone: string,
    nivel?: string,
    foto?: string,
    anexo?: string
}

//////////////////AUTOCOMPLETE/////////////////////////
type TAutoCompleteOption = {
    id: number;
    label: string;
}

////////////////////////////////////////////////////////////

const formValidationSchema: yup.Schema<TFormData> = yup.object().shape({
    nome: yup.string().required().min(3),
    email: yup.string().required(),
    funcaoId: yup.number().transform(value => (isNaN(value) ? undefined : value)).required(),
    dataContratacao: yup.string().min(8).required(),
    dataCriacao: yup.string(),
    telefone: yup.string().min(9).required(),
    nivel: yup.string().required(),
    foto: yup.string(),
    anexo: yup.string()
});

export const FormBasic: React.FC = () => {
    const { register, control, watch, 
            handleSubmit, reset, setError, 
            formState: { errors } } = useForm<TFormData>();
    const [nome] = useState('');
    const { id = 'nova' } = useParams<'id'>();

    const navigate = useNavigate();

  //////////////////////AUTOCOMPLETE///////////////////  
    const { clearErrors } = useForm<TAutoCompleteOption>();
    const [selectedId, setSelectedId] = useState<number | undefined>();
    const [opcoes, setOpcoes] = useState<TAutoCompleteOption[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [busca, setBusca] = useState('');

   // Observa o valor do campo 'funcaoIdId'
   useEffect(() => {
    const subscription = watch((value) => {
        setSelectedId(value.funcaoId);
    });
    return () => subscription.unsubscribe();
}, [watch]);

const useDebounce = (callback: (...args: any[]) => void, delay: number) => {
    const debouncedCallback = useCallback((...args: any[]) => {
        const handler = setTimeout(() => {
            callback(...args);
        }, delay);
        return () => clearTimeout(handler);
    }, [callback, delay]);

    return debouncedCallback;
};

const fetchData = useCallback(() => {
    FuncoesService.getAll(1, busca)
        .then((result) => {
            setIsLoading(false);
            if (result instanceof Error) {
                // Trate o erro aqui
            } else {
                setOpcoes(result.data.map(funcao => ({ id: funcao.id, label: funcao.nome })));
            }
        });
}, [busca]);

const debouncedFetchData = useDebounce(fetchData, 300); // 300ms de delay

useEffect(() => {
    setIsLoading(true);
    debouncedFetchData();
}, [busca, debouncedFetchData]);

// Obtém a opção selecionada baseada no selectedId
    const autoCompleteSelectedOption = useMemo(() => {
        if(!selectedId) return null;

        const selectedOption = opcoes.find(opcao => opcao.id === selectedId);
        if(!selectedOption) return null;

        return selectedOption;
    }, [selectedId, opcoes]);



    /////////////////DATA//////////////////////////////////////

    const horarioAtual = new Date().toLocaleTimeString();
    const fullYear =  new Date().getFullYear().toString();
    const month = (new Date().getMonth()+1).toString().padStart(2, '0');
    const day = new Date().getDate().toString().padStart(2, '0');
    const todayOfTheTime = (fullYear+'-'+month+'-'+day+'T'+horarioAtual); 

    //////////////////////////////////////////////////////////
   
    useEffect(() => {
            reset({
                nome: '',
                email: '',
                funcaoId: undefined,
                dataContratacao: '',
                dataCriacao: todayOfTheTime,
                telefone: '',
                nivel: 'normal',
                foto: '',
                anexo: ''
            });
    }, [id]);

    const handleSave = (data:TFormData) => {
        console.log('Dados enviados:', data);
        formValidationSchema
        .validate(data, { abortEarly: false })
        .then((dadosValidados) => {
            setIsLoading(true);

            if (id === 'nova') {
            console.log(dadosValidados);
            setIsLoading(false);
            }
        }).catch((errors: yup.ValidationError) => {
            const validationErrors: IVFormErrors = {};

            errors.inner.forEach(error => {
                if (!error.path) return;
                
                validationErrors[error.path] = error.message;                
            });
            console.log(validationErrors)
            Object.entries(validationErrors).forEach(([key, value]) => {
                setError(key as keyof TFormData, { type: 'manual', message: value });
    });
        })
    }

    return (
        <LayoutBaseDePagina
        titulo={id === 'nova' ? 'Novo Funcionario' : nome} 
        barraDeFerramentas={
        <FerramentasDeDetalhe
        textoBotaoNovo="Nova"
        mostrarBotaoSalvarEFechar
        mostrarBotaoNovo = {id !== 'nova'}
        mostrarBotaoApagar = {id !== 'nova'}

        aoClicarEmSalvar={handleSubmit(handleSave, (erros)=>console.log(erros))}
        aoClicarEmSalvarEFechar={()=>{}}
        aoClicarEmApagar={() => {}}
        aoClicarEmVoltar={() => navigate('/pessoas')}
        aoClicarEmNovo={() => navigate('/pessoas/detalhe/nova')}
/>
        }>

            {isLoading && (
                <LinearProgress variant="indeterminate" />
            )}

        <form onSubmit={handleSubmit(handleSave, (erros)=>console.log(erros))}>
<Box margin={1} display="flex" flexDirection="column" component={Paper} variant="outlined">

<Grid container direction="column" padding={2} spacing={2}>

{isLoading && (
    <Grid item>
        <LinearProgress variant="indeterminate" />
    </Grid>
)}

<Grid container item direction="row" spacing={2}>
    <Grid item xs={12} sm={12} md={6} lg={4} xl={2} >
        <TextField
            placeholder="Nome"
            label="Nome"
            disabled={isLoading}
            fullWidth
            {...register('nome')}
            error={!!errors.nome}
            helperText={errors.nome ? errors.nome.message : ''}
        />
        </Grid>
    </Grid>

    <Grid container item direction="row" spacing={2}>
        <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>     
            <TextField
                disabled={isLoading}
                fullWidth
                type="email"
                label="Email"
                placeholder="Email"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ''}
            />
        </Grid>
    </Grid>
    
    <Grid container item direction="row" spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <Controller
                name="funcaoId"
                control={control}
                
                render={({ field: { onChange } }) => (
                    <Autocomplete
                         openText="Abrir"
                         closeText="Fechar"
                         noOptionsText="Sem opções"
                         loadingText="Carregando..."
             
                         disablePortal
                         value={autoCompleteSelectedOption}
                         loading={isLoading}
                         popupIcon={(isLoading) ? <CircularProgress size={28}/> : undefined}

                         
                         onChange={(_, newValue) => {
                            console.log('Novo Valor:', newValue);
                            onChange(newValue ? Number(newValue.id) : undefined); // Converte para número
                            setSelectedId(newValue ? newValue.id : undefined);
                            setBusca(''); // Limpa a busca quando a opção é selecionada
                            clearErrors(); // Limpa erros do formulário
                        }}
                        onInputChange={(_, newValue) => setBusca(newValue)}
                        options={opcoes}
                        getOptionLabel={(option) => option.label}
                        
                         renderInput={(params) =>( 
                         <TextField 
                            {...params} 
                            label="Funcao" 
                            {...register('funcaoId')}
                            error={!!errors.funcaoId}
                            helperText={errors.funcaoId ? errors.funcaoId.message : ''}
                        
                          />)}
                        />
                )}
                />
            </Grid>
        </Grid>

    <Grid container item direction="row" spacing={2}>
        <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
            <TextField
                disabled={isLoading}
                fullWidth
                type="date"
                placeholder="Data"
                {...register('dataContratacao')}
                error={!!errors.dataContratacao}
                helperText={errors.dataContratacao ? errors.dataContratacao.message : ''}
            />
        </Grid>
    </Grid>
    <Grid container item direction="row" spacing={2}>
        <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
            <Controller
                name="telefone"
                control={control}
                defaultValue="" // Certifique-se de que o valor inicial está correto
                render={({ field }) => (
                    <PatternFormat
                        format="# ####-####"
                        mask="_"
                        allowEmptyFormatting
                        patternChar="#"
                        type="tel"
                        displayType="input"
                        customInput={TextField}
                        size="small"
                        error={!!errors.telefone}
                        helperText={errors.telefone ? errors.telefone.message : ''}
                        placeholder="Telefone"
                        isAllowed={({ value }) => {
                            if (value.length > 9) return false;
                                return true;
                             }}
                        {...field}
                    />
                    )}
                />   
            </Grid>
        </Grid>
           
        </Grid>
        </Box>
        </form>
        </LayoutBaseDePagina>
    );
}