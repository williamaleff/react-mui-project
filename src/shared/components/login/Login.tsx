import { Paper, Avatar, Box, Button, CircularProgress, Link, TextField, Typography } from "@mui/material";
import { useAuthContext } from "../../contexts";
import { useState } from "react";
import * as yup from 'yup';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link as RouterLink, useLocation } from "react-router-dom";

const loginSchema = yup.object().shape({
    email: yup.string().required(),
    password: yup.string().required().min(5),
});

interface ILoginProps {
    children: React.ReactNode;
}
export const Login: React.FC<ILoginProps> = ({children}) => {
    const { isAuthenticated, login } = useAuthContext();

    const [isLoading, setIsLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const location = useLocation();
   // Divide o caminho em segmentos e remove os vazios (caso haja barras extras)
  const segments = location.pathname.split('/').filter(Boolean);
  
  // Se não houver nenhum segmento (estamos na raiz), define o link como "/clock"
  if (segments.length === 0) {
    segments.push("clock");
  } else {
    // Substitui o último segmento por "clock"
    segments[segments.length - 1] = "clock";
  }
  
  // Reconstrói o caminho com uma barra inicial
  const newHref = `/${segments.join('/')}`;


    const handleSubmit = () => {
        setIsLoading(true);

        loginSchema
        .validate({ email, password }, { abortEarly: false })
        .then(dadosValidados => {

        login(dadosValidados.email, dadosValidados.password)
            .then((result) => {
                setIsLoading(false);
                if (result === undefined) {
                    setEmailError('');
                    setPasswordError('');
                } else if(result === 'Request failed with status code 401') {
                    setEmailError('Login ou Senha incorretos');
                    setPasswordError('  ');
                } else {
                    setEmailError('Erro de conexão');
                    setPasswordError('...');
                }
            })
        })
        .catch((errors: yup.ValidationError) => {
            setIsLoading(false);

            errors.inner.forEach(error => {
                if (error.path === 'email') {
                    setEmailError(error.message);
                } else if(error.path === 'password'){
                    setPasswordError(error.message);
                }
            });

        });
    }

    if (isAuthenticated) return(
        <>{children}</>
    );    

    const paperStyle={padding:20,height:'70vh',width:280, margin:"20px auto"}
    const avatarStyle={backgroundColor:'#1bbd7e'}
    return(
        <Box width='100vw' height='100vh' display='flex' alignItems='center' justifyContent='center'>
            <Box elevation={10} style={paperStyle} component={Paper}>
                <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
                <Box display='flex' flexDirection='column' justifyContent="center" alignItems='center'>
                     <Avatar style={avatarStyle}><LockOutlinedIcon /></Avatar>
                    <h2>Entrar</h2>
                </Box>
                <Box gap={1} display='flex' flexDirection='column'>
                <TextField 
                             fullWidth 
                             label='Email' 
                             type="email"
                             value={email}
                             InputLabelProps={{ shrink: true }}
                             disabled={isLoading}
                             error={!!emailError}
                             helperText={emailError}
                             onKeyDown={() => setEmailError('')}
                             onChange={e => setEmail(e.target.value)} 
                             />

                         <TextField 
                             fullWidth 
                             label='Senha' 
                             type="password" 
                             value={password}
                             InputLabelProps={{ shrink: true }}
                             disabled={isLoading}
                             error={!!passwordError}
                             helperText={passwordError}
                             onKeyDown={() => setPasswordError('')}
                             onChange={e => setPassword(e.target.value)}
                             />
 
                <Button
                             disabled={isLoading}
                             variant="contained"
                             onClick={handleSubmit}
                             startIcon={isLoading ? <CircularProgress variant="indeterminate" color="inherit" size={20} /> : undefined}
                         >
                             Entrar
                </Button>

                <Typography >
                    <Link component={RouterLink} to={newHref} underline="none">
                        Ir para tela de registro do ponto?
                    </Link>
                </Typography>
                </Box>
                </Box>
            </Box>
        </Box>
    )

}