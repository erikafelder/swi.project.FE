import { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Button, Typography, Box, Chip
} from '@mui/material';

interface Loan {
    id: number;
    loanDate: string;
    dueDate: string;
    returnDate: string | null;
    fineAmount: number;
    book: {
        id: number;
        title: string;
        authors?: { name: string }[];
    };
}

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

const Users = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUserLoans, setSelectedUserLoans] = useState<Loan[]>([]);
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

    const handleShowLoans = async (userId: string, firstName: string, lastName: string) => {
        try {
            const response = await fetch(`http://localhost:8080/api/loans/user/${userId}`);
            if (response.ok) {
                const loans = await response.json();
                setSelectedUserLoans(loans);
                setSelectedUserName(`${firstName} ${lastName}`);
                setSelectedUserId(userId);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleReturnBook = async (bookId: number) => {
        const response = await fetch(`http://localhost:8080/api/books/${bookId}/loan/return`, {
            method: 'POST'
        });
        if (response.ok && selectedUserId) {
            const loan: Loan = await response.json();
            if (loan.fineAmount && loan.fineAmount > 0) {
                alert(`Kniha vrácena! Pokuta za pozdní vrácení: ${loan.fineAmount} Kč`);
            } else {
                alert('Kniha úspěšně vrácena!');
            }
            handleShowLoans(selectedUserId, selectedUserName.split(' ')[0], selectedUserName.split(' ')[1]);
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
                                        onClick={() => handleShowLoans(user.id, user.firstName, user.lastName)}
                                    >
                                        Zobraz výpůjčky
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
                        Výpůjčky: <strong>{selectedUserName}</strong>
                    </Typography>

                    {selectedUserLoans.filter(l => !l.returnDate).length > 0 ? (
                        <TableContainer component={Paper} sx={{ maxWidth: 800, boxShadow: 2 }}>
                            <Table size="small">
                                <TableHead sx={{ backgroundColor: '#EFEBE9' }}>
                                    <TableRow>
                                        <TableCell><strong>Kniha</strong></TableCell>
                                        <TableCell><strong>Půjčeno</strong></TableCell>
                                        <TableCell><strong>Vrátit do</strong></TableCell>
                                        <TableCell><strong>Stav</strong></TableCell>
                                        <TableCell align="right"><strong>Akce</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selectedUserLoans
                                        .filter(l => !l.returnDate)
                                        .map((loan) => (
                                            <TableRow key={loan.id}>
                                                <TableCell>{loan.book.title}</TableCell>
                                                <TableCell>{loan.loanDate}</TableCell>
                                                <TableCell>{loan.dueDate}</TableCell>
                                                <TableCell>
                                                    {new Date(loan.dueDate) < new Date()
                                                        ? <Chip label="PO TERMÍNU" color="error" size="small" />
                                                        : <Chip label="V pořádku" color="success" size="small" />
                                                    }
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        color="secondary"
                                                        onClick={() => handleReturnBook(loan.book.id)}
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