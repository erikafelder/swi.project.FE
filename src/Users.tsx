import { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Button, Typography, Box
} from '@mui/material';

interface Book {
    id: string;
    title: string;
    author?: { name: string };
}

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

const Users = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUserBooks, setSelectedUserBooks] = useState<Book[]>([]);
    const [selectedUserName, setSelectedUserName] = useState<string>('');
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const fetchUsers = () => {
        fetch('http://localhost:8080/api/users')
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleShowBooks = async (userId: string, firstName: string, lastName: string) => {
        try {
            const response = await fetch(`http://localhost:8080/api/loans/user/${userId}`);
            if (response.ok) {
                const books = await response.json();
                setSelectedUserBooks(books);
                setSelectedUserName(`${firstName} ${lastName}`);
                setSelectedUserId(userId);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleReturnBook = async (bookId: string) => {
        const response = await fetch(`http://localhost:8080/api/books/${bookId}/loan/return`, {
            method: 'POST'
        });
        if (response.ok && selectedUserId) {
            handleShowBooks(selectedUserId, selectedUserName.split(' ')[0], selectedUserName.split(' ')[1]);
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#5D4037' }}>
                Správa čtenářů
            </Typography>

            <TableContainer component={Paper} sx={{ mb: 4, boxShadow: 3 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#D7CCC8' }}>
                        <TableRow>
                            <TableCell><strong>Jméno</strong></TableCell>
                            <TableCell><strong>Příjmení</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell align="center"><strong>Akce</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id} hover>
                                <TableCell>{user.firstName}</TableCell>
                                <TableCell>{user.lastName}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell align="center">
                                    <Button
                                        variant="contained"
                                        size="small"
                                        sx={{ backgroundColor: '#5D4037', '&:hover': { backgroundColor: '#4E342E' } }}
                                        onClick={() => handleShowBooks(user.id, user.firstName, user.lastName)}
                                    >
                                        Zobraz knihy
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {selectedUserName && (
                <Box sx={{ mt: 4, p: 2, borderTop: '2px solid #5D4037', backgroundColor: '#FDFCF6' }}>
                    <Typography variant="h5" gutterBottom sx={{ color: '#5D4037' }}>
                        Vypůjčené knihy: <strong>{selectedUserName}</strong>
                    </Typography>

                    {selectedUserBooks.length > 0 ? (
                        <TableContainer component={Paper} sx={{ maxWidth: 600, boxShadow: 2 }}>
                            <Table size="small">
                                <TableHead sx={{ backgroundColor: '#EFEBE9' }}>
                                    <TableRow>
                                        <TableCell><strong>Název knihy</strong></TableCell>
                                        <TableCell><strong>Autor</strong></TableCell>
                                        <TableCell align="right"><strong>Akce</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selectedUserBooks.map((book) => (
                                        <TableRow key={book.id}>
                                            <TableCell>{book.title}</TableCell>
                                            <TableCell>{book.author ? book.author.name : 'Neznámý'}</TableCell>
                                            <TableCell align="right">
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="secondary"
                                                    onClick={() => handleReturnBook(book.id)}
                                                >
                                                    Vrátit
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Typography sx={{ fontStyle: 'italic' }}>Tento člověk nemá nic půjčeného.</Typography>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default Users;