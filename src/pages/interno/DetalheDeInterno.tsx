import { LayoutBaseDePagina } from "../../shared/layouts";
import { FerramentasDeDetalhe } from "../../shared/components";
import { Box, Button, CircularProgress, Grid, LinearProgress, Paper, Snackbar, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { IVFormErrors, useHookFormInterno } from "../../shared/forms";
import { InternoService } from "../../shared/services/api/interno/InternoService";
import { TFormDataInterno } from "../../shared/forms/TFormDataInterno";
import { Avatar, IconButton } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { UploadService } from "../../shared/services/api/interno/UploadService";
import { CandidatosService } from "../../shared/services/api/candidatos/CandidatosService";
import { Alert } from "../../shared/forms/Alert";

const formValidationSchema: yup.Schema<TFormDataInterno> = yup.object().shape({
  prontuario: yup.string().required().min(3),
  nome: yup.string().required().min(3),
  mae: yup.string().required(),
  localizacao: yup.string().required(),
  regime: yup.string().required(),
  funcao: yup.string().required(),
  unidade: yup.string().required(),
  digital: yup.string().required(),
  foto: yup.string().required()
});

export const DetalheDeInterno: React.FC = () => {
  const { id = "novo" } = useParams<"id">();
  const [isLoading, setIsLoading] = useState(false);
  const [nome, setNome] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openError, setOpenError] = useState(false);
 
   // Função para fechar o Snackbar
    const handleClose = (
     _event?: React.SyntheticEvent | Event,
     reason?: string
   ) => {
     if (reason === 'clickaway') {
       return;
     }
     setOpenError(false);
   }; 

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    isSavingAndClose,
    reset,
    setError,
    setValue,
    errors,
  } = useHookFormInterno();

  // Crie uma variável para os props do prontuário
  const prontuarioRegister = register("prontuario");
  const { ref, onBlur: formOnBlur, ...rest } = prontuarioRegister;

  useEffect(() => {
    if (id !== 'novo') {
      setIsLoading(true);
      
      InternoService.getById(Number(id))
      .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            setErrorMessage(result.message);
            setOpenError(true);
            navigate('/interno');                    
          } else {
              setNome(result.nome);
              Object.entries(result).forEach( ([chave, valor]) => {
                setValue(chave as keyof TFormDataInterno, valor)} )

              UploadService.getByfile(result.foto).then((data) => {
                  if (data instanceof Error) {
                    setErrorMessage(data.message);
                    setOpenError(true);
                  } else {
                    const imageUrlPreview = URL.createObjectURL(data);
                    setImage(imageUrlPreview)
                  }              
              })
          }
      });
      
  } else {
    reset({
      nome: '',
      mae: '',
      localizacao: '',
      regime: 'FECHADO/CONDENADO',
      funcao: '',
      prontuario: '',
      unidade: 'UNIDADE PRISIONAL REGIONAL DE SOBRAL',
      digital: '',
      foto: ''
    });
  }
  }, [id, setValue, reset]);

  const handleSave = async(data: TFormDataInterno) => {
    setIsLoading(true);

  // Aguarda o upload terminar e pega a URL retornada
  var uploadedFileUrl = await handleUpload();

  if (uploadedFileUrl instanceof Error) {
    setErrorMessage(uploadedFileUrl.message);
    setOpenError(true);

    await UploadService.getByfile("http://localhost:8989/uploads/blackdefaultavatar.png").then((data) => {
      
      if (data instanceof Error) {
        setErrorMessage(data.message);
        setOpenError(true);
        setIsLoading(false);
        return;
      } else {
        const imageUrlPreview = URL.createObjectURL(data);
        setImage(imageUrlPreview)
        uploadedFileUrl = "http://localhost:8989/uploads/blackdefaultavatar.png"
      }
    })
    
  }

  // Atualiza o campo "foto" com a URL retornada do upload
  const formData = { ...data, foto: uploadedFileUrl };

  await formValidationSchema
      .validate(formData, { abortEarly: false })
      .then((dadosValidados) => {
        setIsLoading(true);

        if (id === "novo") {
          InternoService.create(dadosValidados).then((result) => {
            setIsLoading(false);

            if (result instanceof Error) {
              setErrorMessage(result.message);
              setOpenError(true);
            } else {
              if (isSavingAndClose.current) {
                navigate("/interno");
              } else {
                navigate(`/interno/detalhe/${result}`);
              }
            }
          });
        } else {
          InternoService.updateById(Number(id), {
            id: Number(id),
            ...dadosValidados,
          }).then((result) => {
            setIsLoading(false);

            if (result instanceof Error) {
              setErrorMessage(result.message);
              setOpenError(true);
              } else {
              if (isSavingAndClose.current) {
                navigate("/interno");
              }
            }
          });
        }
      })
      .catch((errors: yup.ValidationError) => {
        setIsLoading(false);
        const validationErrors: IVFormErrors = {};

        errors.inner.forEach((error) => {
          if (!error.path) return;

          validationErrors[error.path] = error.message;
        });
        Object.entries(validationErrors).forEach(([key, value]) => {
          setError(key as keyof TFormDataInterno, { type: "manual", message: value });
        });
      });
  };

  const handleDelete = (id: number) => {
    if (confirm('Realmente deseja apagar?')) {
        InternoService.deleteById(id)
        .then(result => {
            if (result instanceof Error) {
                setErrorMessage(result.message);
                setOpenError(true);
            } else {
                alert("Registro apagado com sucesso!")
                navigate('/interno');
            }
        });            
    }
}

const [image, setImage] = useState<string | null>(null);
const [file, setFile] = useState<File | null>(null);

const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  if (event.target.files && event.target.files[0]) {
    const file2 = event.target.files[0];
    const imageUrl = URL.createObjectURL(file2);
    setImage(imageUrl);
    setFile(file2);
  }
};

 // Função para realizar o upload do arquivo para o endpoint do Spring Boot
 const handleUpload = async(): Promise<String | Error> => {
    if (!file) return new Error("Nenhum arquivo selecionado.");
    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    return await UploadService.create(formData).then((result) => {
     
      if (result instanceof Error) {
        setErrorMessage(result.message + "\n Não foi possível enviar a foto para o backend");
        setOpenError(true);
        return new Error(result.message)
      } else {
        setValue("foto", String(result.url));
        return String(result.url);
      }
    });  

};

////////////////////////////////////////////////////

const [loading, setLoading] = useState(false);
  
  const handleClick = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:9000/api/public/v1/captura/Capturar/1');
      const data = await response.json();
      setValue("digital", data || "Digital cadastrada")
      if(data == null){
        setErrorMessage("Sem resposta do leitor biométrico.");
        setOpenError(true);
      }
    } catch (error) {
      setErrorMessage("Erro ao chamar API: "+ error);
      setOpenError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleProntuarioBlur = async (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const prontuario = event.target.value;

    if (/^\d{6}$/.test(prontuario) || /^\d{5}$/.test(prontuario)) {
      try {
        const candidato = await CandidatosService.getCandidatoByProntuario(prontuario);
        
        // Se a API retornar os dados do candidato, preenche os campos
        if (candidato) {
          setValue('nome', candidato.nome || '');
          setValue('mae', candidato.mae || '');
          // Mapeia a propriedade "ultimaLocalizacao" para o campo "localizacao" do formulário
          setValue('localizacao', candidato.ultimaLocalizacao || '');
          // Mapeia "tipoDeRegime" para "regime"
          setValue('regime', candidato.tipoDeRegime || '');
          setValue('funcao', candidato.funcao || '');
          setValue('unidade', candidato.unidade || '');
        } else {
          setErrorMessage("Candidato não encontrado.");
          setOpenError(true);
        }
      } catch (error: any) {
        setErrorMessage("Erro ao buscar candidato: "+ error);
        setOpenError(true);
      }
    } else {
      setError('prontuario', { type: 'manual', message: 'O prontuário deve conter 5 ou 6 números.' });
    }
  };

  return (
    <LayoutBaseDePagina
      titulo={id === "novo" ? "Novo Funcionario" : nome}
      barraDeFerramentas={
        <FerramentasDeDetalhe
          textoBotaoNovo="Novo"
          mostrarBotaoSalvarEFechar
          mostrarBotaoNovo={id !== "novo"}
          mostrarBotaoApagar={id !== "novo"}
          aoClicarEmSalvar={handleSubmit(handleSave)}
          aoClicarEmSalvarEFechar={() => {
            isSavingAndClose.current = true;
            handleSubmit(handleSave)();
          }}
          aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmVoltar={() => navigate("/interno")}
          aoClicarEmNovo={() => navigate("/interno/detalhe/novo")}
        />
      }
    >
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

      {isLoading && <LinearProgress variant="indeterminate" />}

      <form onSubmit={handleSubmit(handleSave)}>
        <Box
          margin={1}
          display="flex"
          flexDirection="column"
          component={Paper}
          variant="outlined"
        >
          <Grid container direction="column" padding={2} spacing={2}>
            {isLoading && (
              <Grid item>
                <LinearProgress variant="indeterminate" />
              </Grid>
            )}

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
              <input
        accept="image/*"
        type="file"
        id="upload-photo"
        style={{ display: "none" }}
        onChange={handleImageChange}
      />
       <label htmlFor="upload-photo">
        <IconButton component="span" style={{ position: "relative" }}>
          <Avatar
            src={image || ""}
            sx={{ width: 100, height: 100 }}
          />
          <PhotoCameraIcon
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              backgroundColor: "white",
              borderRadius: "50%",
              padding: "4px",
            }}
          />
        </IconButton>
      </label>
                <TextField style={{ margin: "5% 2%" }}
                  placeholder="Prontuário"
                  label="Prontuário"
                  disabled={isLoading}
                  onBlur={(e) => {
                    // Primeiro chama o onBlur do react-hook-form
                    formOnBlur(e);
                    // Em seguida, a sua função customizada
                    handleProntuarioBlur(e);
                  }}
                  inputRef={ref}
                  {...rest}
                  inputProps={{ inputMode: 'numeric', maxLength: 6, pattern: '[0-9]*' }} // Corrigido para inputProps
                  InputLabelProps={{ shrink: true }} 
                  error={!!errors.prontuario}
                  helperText={errors.prontuario ? errors.prontuario.message : ""}
                />
              </Grid>
            </Grid>     

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <TextField
                  placeholder="Nome"
                  label="Nome"
                  disabled={isLoading}
                  InputLabelProps={{ shrink: true }} 
                  fullWidth
                  {...register("nome")}
                  error={!!errors.nome}
                  helperText={errors.nome ? errors.nome.message : ""}
                />
              </Grid>
            </Grid>          

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <TextField
                  placeholder="Mãe"
                  label="Mãe"
                  disabled={isLoading}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  {...register("mae")}
                  error={!!errors.mae}
                  helperText={errors.mae ? errors.mae.message : ""}
                />
              </Grid>
            </Grid>          

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <TextField
                  placeholder="Localização"
                  label="Localização"
                  disabled={isLoading}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  {...register("localizacao")}
                  error={!!errors.localizacao}
                  helperText={errors.localizacao ? errors.localizacao.message : ""}
                />
              </Grid>
            </Grid>          

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <TextField
                  placeholder="Função/Cargo"
                  label="Função/Cargo"
                  disabled={isLoading}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  {...register("funcao")}
                  error={!!errors.funcao}
                  helperText={errors.funcao ? errors.funcao.message : ""}
                />
              </Grid>
            </Grid>   

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
              <Button
      variant="contained"
      color="primary"
      onClick={handleClick}
      disabled={loading}
      
      startIcon={loading ? <CircularProgress size={20} /> : null}
    >
      {loading ? "Carregando..." : "Cadastrar digital"}
    </Button>
              </Grid>
            </Grid>   
          </Grid>
        </Box>
      </form>
    </LayoutBaseDePagina>
  );
};
