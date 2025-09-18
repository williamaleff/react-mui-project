import { Paper, Avatar, Box, Button, CircularProgress, TextField } from "@mui/material";
import { useAuthContext } from "../../contexts";
import { useRef, useState } from "react";
import * as yup from 'yup';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link as RouterLink } from "react-router-dom";

const loginSchema = yup.object().shape({
    email: yup.string().required(),
    password: yup.string().required().min(5),
});

interface ILoginProps {
    children: React.ReactNode;
}
export const Login: React.FC<ILoginProps> = ({ children }) => {
    const { isAuthenticated, login } = useAuthContext();

    const [isLoading, setIsLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const passwordRef = useRef<HTMLInputElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);


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
                        } else if (result === 'Request failed with status code 401') {
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
                    } else if (error.path === 'password') {
                        setPasswordError(error.message);
                    }
                });

            });
    }

    if (isAuthenticated) return (
        <>{children}</>
    );


    const handleEmailKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            passwordRef.current?.focus();
        }
        setEmailError('');
    };

    const handlePasswordKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            buttonRef.current?.focus();
            buttonRef.current?.click(); // Executa o clique no botão
        }
        setPasswordError('');
    };

    const paperStyle = { padding: 20, height: '70vh', width: 280, margin: "20px auto" }
    const avatarStyle = { backgroundColor: '#1bbd7e' }
    return (
        <Box width='100vw' height='100vh' display='flex' alignItems='center' justifyContent='center'>

            <Box elevation={10} style={paperStyle} component={Paper}>
                <Box display='flex' flexDirection='column' justifyContent="center" alignItems='center' marginBottom={4}>
                    <Box display="grid" gridTemplateColumns="40px auto 40px" alignItems="center" width="100%">
                        <Box display="flex" justifyContent="flex-end" alignItems="center">
                            <Avatar style={{ ...avatarStyle, transform: 'translateX(30px)' }}>
                                <LockOutlinedIcon />
                            </Avatar>
                        </Box>
                        <h1 style={{ marginInline: 4, textAlign: 'center' }}>Hefesto</h1>
                        <Box />
                    </Box>
                    <h2 style={{ margin: 2, width: '100%', textAlign: 'center' }}>Sistema de Gerenciamento local</h2>
                </Box>
                <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center'>

                    <Box gap={1} display='flex' flexDirection='column'>
                        <TextField
                            fullWidth
                            label='Login'
                            type="email"
                            value={email}
                            InputLabelProps={{ shrink: true }}
                            disabled={isLoading}
                            error={!!emailError}
                            helperText={emailError}
                            onKeyDown={handleEmailKeyDown}
                            onChange={e => setEmail(e.target.value)}
                        />

                        <TextField
                            inputRef={passwordRef}
                            fullWidth
                            label='Senha'
                            type="password"
                            value={password}
                            InputLabelProps={{ shrink: true }}
                            disabled={isLoading}
                            error={!!passwordError}
                            helperText={passwordError}
                            onKeyDown={handlePasswordKeyDown}
                            onChange={e => setPassword(e.target.value)}
                        />

                        <Button
                            ref={buttonRef}
                            disabled={isLoading}
                            variant="contained"
                            onClick={handleSubmit}
                            startIcon={isLoading ? <CircularProgress variant="indeterminate" color="inherit" size={20} /> : undefined}
                        >
                            Entrar
                        </Button>

                        <Button
                            component={RouterLink}
                            disabled={isLoading}
                            to="/clock"
                            variant="contained"
                            color="secondary"
                            fullWidth // opcional, se quiser ocupar toda a largura
                            startIcon={isLoading ? <CircularProgress variant="indeterminate" color="inherit" size={20} /> : undefined}
                            sx={{ textTransform: 'none', mt: 2 }} // opcional: evita o texto em CAPS LOCK
                        >
                            Ir para tela de registro do ponto?
                        </Button>

                    </Box>
                </Box>
            </Box>
        </Box>
    )

}