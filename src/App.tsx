import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { useState } from 'react';

import Users from './Users.tsx';
import Books from './Books.tsx';
import Login from './Login.tsx';
import Register from './Register.tsx';
import './App.css';

interface User {
    id: string;
    username?: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

function App() {
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
    const [showRegister, setShowRegister] = useState(false);

    if (!loggedInUser) {
        if (showRegister) {
            return (
                <Register
                    onBackToLogin={() => setShowRegister(false)}
                />
            );
        }

        return (
            <Login
                onLogin={(user: User) => setLoggedInUser(user)}
                onShowRegister={() => setShowRegister(true)}
            />
        );
    }

    const isAdmin = loggedInUser.role === 'ADMIN';

    return (
        <BrowserRouter>
            <AppBar
                position="static"
                sx={{
                    backgroundColor: '#3E2723',
                    boxShadow: 3
                }}
            >
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Knihovna Eriky a Jonáše
                    </Typography>

                    <Button color="inherit" component={Link} to="/">
                        Katalog knih
                    </Button>

                    <Button color="inherit" component={Link} to="/users">
                        Čtenáři
                    </Button>

                    <Button color="inherit" onClick={() => setLoggedInUser(null)}>
                        Odhlásit ({loggedInUser.firstName})
                    </Button>
                </Toolbar>
            </AppBar>

            <Container>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Books
                                isAdmin={isAdmin}
                                currentUserId={loggedInUser.id}
                            />
                        }
                    />

                    <Route
                        path="/users"
                        element={
                            <Users
                                currentUser={loggedInUser}
                                isAdmin={isAdmin}
                            />
                        }
                    />
                </Routes>
            </Container>
        </BrowserRouter>
    );
}

export default App;