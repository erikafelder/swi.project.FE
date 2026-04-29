import { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Alert } from '@mui/material';

interface RegisterProps {
    onBackToLogin: () => void;
}

const Register = ({ onBackToLogin }: RegisterProps) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async () => {
        if (!username || !password || !firstName || !lastName) {
            setError('Vyplňte prosím všechna povinná pole.');
            return;
        }

        try {
            const res = await fetch('http://localhost:8080/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: username.trim(),
                    password: password.trim(),
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    email: email.trim(),
                    age: age ? parseInt(age) : null
                })
            });

            if (res.ok) {
                setSuccess(true);
                setError('');
                setTimeout(() => onBackToLogin(), 2000);
            } else {
                setError('Registrace se nezdařila. Uživatelské jméno již možná existuje.');
            }
        } catch (err) {
            console.error('Chyba při registraci:', err);
            setError('Server neběží nebo je chyba v síti.');
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#EFEBE9' }}>
            <Paper sx={{ p: 4, width: 320, textAlign: 'center', boxShadow: 5, borderRadius: 3 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#5D4037' }}>
                    Registrace
                </Typography>

                {success && <Alert severity="success" sx={{ mb: 2 }}>Účet vytvořen. Přesměrování...</Alert>}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <TextField fullWidth label="Uživatelské jméno *" sx={{ mb: 2 }} value={username} onChange={e => setUsername(e.target.value)} />
                <TextField fullWidth label="Heslo *" type="password" sx={{ mb: 2 }} value={password} onChange={e => setPassword(e.target.value)} />
                <TextField fullWidth label="Jméno *" sx={{ mb: 2 }} value={firstName} onChange={e => setFirstName(e.target.value)} />
                <TextField fullWidth label="Příjmení *" sx={{ mb: 2 }} value={lastName} onChange={e => setLastName(e.target.value)} />
                <TextField fullWidth label="Email" sx={{ mb: 2 }} value={email} onChange={e => setEmail(e.target.value)} />
                <TextField fullWidth label="Věk" type="number" sx={{ mb: 3 }} value={age} onChange={e => setAge(e.target.value)} />

                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleRegister}
                    sx={{ mb: 2, backgroundColor: '#5D4037', '&:hover': { backgroundColor: '#4E342E' } }}
                >
                    Registrovat se
                </Button>
                <Button
                    fullWidth
                    variant="text"
                    onClick={onBackToLogin}
                    sx={{ color: '#5D4037' }}
                >
                    Zpět na přihlášení
                </Button>
            </Paper>
        </Box>
    );
};

export default Register;