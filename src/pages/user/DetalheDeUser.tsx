import { LayoutBaseDePagina } from "../../shared/layouts";
import { FerramentasDeDetalhe } from "../../shared/components";
import { Box, Grid, LinearProgress, Paper, TextField, InputAdornment, MenuItem, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { IVFormErrors } from "../../shared/forms";
import { UserService } from "../../shared/services/api/user/UserService";
import { IconButton } from "@mui/material";
import { TFormDataUser } from "../../shared/forms/TFormDataUser";
import { useHookFormUser } from "./form/useHookFormUser";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Alert } from "../../shared/forms/Alert";

interface TFormDataUserWithConfirm extends TFormDataUser {
  confirmPassword: string;
}

const formValidationSchema: yup.Schema<TFormDataUserWithConfirm> = yup.object().shape({
  login: yup.string().required('Login é obrigatório'),
  password: yup.string().min(6, 'A senha deve ter pelo menos 6 caracteres').required('Senha é obrigatória'),
  confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "As senhas não coincidem")
      .required("Confirmação de senha é obrigatória"),
  role: yup.string().oneOf(['ADMIN', 'USER'], 'Role deve ser ADMIN ou USER').required('Role é obrigatória'),
});

export const DetalheDeUser: React.FC = () => {
  const { id = "novo" } = useParams<"id">();
  const [isLoading, setIsLoading] = useState(false);
  const [nome, setNome] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [labelSenha, setLabelSenha] = useState('Senha');
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

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    isSavingAndClose,
    reset,
    setError,
    setValue,
    errors,
  } = useHookFormUser<TFormDataUserWithConfirm>();

  
  useEffect(() => {
    if (id !== 'novo') {
      setIsLoading(true);
      
      UserService.getById(id)
      .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
              setErrorMessage(result.message);
              setOpenError(true);  
              navigate('/user');                    
          } else {
              setNome(result.login);
              setLabelSenha("Alterar Senha")
              Object.entries(result).forEach( ([chave, valor]) => {
                if (chave !== "password") {                
                  setValue(chave as keyof TFormDataUser, valor);
                }
              } )
          }
      });
      
  } else {
    reset({
      login: '',
      password: '',
      confirmPassword: '',
      role: 'ADMIN'
        });
  }
  }, [id, setValue, reset]);

  const handleSave = async(data:  TFormDataUserWithConfirm) => {
    setIsLoading(true);

  await formValidationSchema
      .validate(data, { abortEarly: false })
      .then((dadosValidados) => {
        setIsLoading(true);

        // Removemos confirmPassword antes de enviar os dados para o backend
        const { confirmPassword, ...dataToSubmit } = dadosValidados;


        if (id === "novo") {
          UserService.create(dataToSubmit).then((result) => {
            setIsLoading(false);

            if (result instanceof Error) {
              setErrorMessage(result.message);
              setOpenError(true);
            } else {
              if (isSavingAndClose.current) {
                navigate("/user");
              } else {
                navigate(`/user/detalhe/${result}`);
              }
            }
          });
        } else {
          UserService.updateById(String(id), {
            id: String(id),
            ...dataToSubmit,
          }).then((result) => {
            setIsLoading(false);

            if (result instanceof Error) {
              setErrorMessage(result.message);
              setOpenError(true);
            } else {
              if (isSavingAndClose.current) {
                navigate("/user");
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
          setError(key as keyof TFormDataUser, { type: "manual", message: value });
        });
      });
  };

  const handleDelete = (id: string) => {
    if (confirm('Realmente deseja apagar?')) {
        UserService.deleteById(id)
        .then(result => {
            if (result instanceof Error) {
                setErrorMessage(result.message);
                setOpenError(true);
            } else {
              alert("Registro apagado com sucesso!");
              navigate('/user');
            }
        });            
    }
}


////////////////////////////////////////////////////

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
          aoClicarEmApagar={() => handleDelete(String(id))}
          aoClicarEmVoltar={() => navigate("/user")}
          aoClicarEmNovo={() => navigate("/user/detalhe/novo")}
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
                <TextField
                  placeholder="Login"
                  label="Login"
                  disabled={isLoading}
                  InputLabelProps={{ shrink: true }} 
                  fullWidth
                  {...register("login")}
                  error={!!errors.login}
                  helperText={errors.login ? errors.login.message : ""}
                />
              </Grid>
            </Grid>          

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <TextField
                  placeholder="Senha"
                  label={labelSenha}
                  disabled={isLoading}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  type={showPassword ? 'text' : 'password'}
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password ? errors.password.message : ""}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
            </Grid>    

            {/* Campo de confirmação de senha */}
            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <TextField
                  placeholder="Confirmar Senha"
                  label="Confirmar Senha"
                  disabled={isLoading}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  error={!!errors.confirmPassword}
                  helperText={
                    errors.confirmPassword ? errors.confirmPassword.message : ""
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>      

            <Grid container item direction="row" spacing={2}>
  <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
    <TextField
      select
      placeholder="Acesso"
      label="Acesso"
      disabled={isLoading}
      fullWidth
      InputLabelProps={{ shrink: true }}
      {...register("role")}
      error={!!errors.role}
      helperText={errors.role ? errors.role.message : ""}
      defaultValue="ADMIN"
    >
      <MenuItem value="ADMIN">ADMIN</MenuItem>
      <MenuItem value="USER">USER</MenuItem>
    </TextField>
  </Grid>
</Grid>
          </Grid>
        </Box>
      </form>
    </LayoutBaseDePagina>
  );
};
