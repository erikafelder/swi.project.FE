import { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

interface LoginProps {
    onLogin: (user: User) => void;
    onShowRegister: () => void;
}

const Login = ({ onLogin, onShowRegister }: LoginProps) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: username.trim(),
                    password: password.trim()
                })
            });

            if (res.ok) {
                const user = await res.json() as User;
                onLogin(user);
            } else {
                alert('Neplatné jméno nebo heslo.');
            }
        } catch (err: unknown) {
            console.error("Chyba při přihlašování:", err);
            alert('Server neběží nebo je chyba v síti.');
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#EFEBE9' }}>
            <Paper sx={{ p: 4, width: 320, textAlign: 'center', boxShadow: 5, borderRadius: 3 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#5D4037' }}>
                    Knihovna Erika & Jonáš
                </Typography>
                <TextField
                    fullWidth
                    label="Uživatelské jméno"
                    sx={{ mb: 2 }}
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <TextField
                    fullWidth
                    label="Heslo"
                    type="password"
                    sx={{ mb: 3 }}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleLogin}
                    sx={{ mb: 1, backgroundColor: '#5D4037', '&:hover': { backgroundColor: '#4E342E' } }}
                >
                    Vstoupit
                </Button>
                <Button
                    fullWidth
                    variant="text"
                    onClick={onShowRegister}
                    sx={{ color: '#5D4037' }}
                >
                    Nemáte účet? Registrujte se
                </Button>
            </Paper>
        </Box>
    );
};

export default Login;