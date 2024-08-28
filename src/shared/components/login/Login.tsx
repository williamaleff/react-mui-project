import { Paper, Avatar, Box, Button, Checkbox, CircularProgress, FormControlLabel, Link, TextField, Typography } from "@mui/material";
import { useAuthContext } from "../../contexts";
import { useState } from "react";
import * as yup from 'yup';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

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

    const handleSubmit = () => {
        setIsLoading(true);

        loginSchema
        .validate({ email, password }, { abortEarly: false })
        .then(dadosValidados => {

            login(dadosValidados.email, dadosValidados.password)
            .then(() => {
                setIsLoading(false);
            });
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
                             disabled={isLoading}
                             error={!!passwordError}
                             helperText={passwordError}
                             onKeyDown={() => setPasswordError('')}
                             onChange={e => setPassword(e.target.value)}
                             />
 
                <FormControlLabel
                    control={
                    <Checkbox
                        name="checkedB"
                        color="primary"
                    />
                    }
                    label="Lembre-me"
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
                     <Link href="#" >
                        Esqueceu a senha ?
                </Link>
                </Typography>
                <Typography > Você não tem uma conta? 
                     <Link href="#" >
                        Inscrição 
                </Link>
                </Typography>
                </Box>
                </Box>
            </Box>
        </Box>
    )

}