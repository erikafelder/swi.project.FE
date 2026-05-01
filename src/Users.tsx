import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Chip,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';

interface User {
    id: string;
    username?: string;
    firstName: string;
    lastName: string;
    email?: string;
    role: string;
}

interface Book {
    id: number;
    title: string;
}

interface Loan {
    id: number;
    loanDate: string;
    dueDate: string;
    returnDate?: string | null;
    fineAmount?: number | null;
    book?: Book;
}

interface UsersProps {
    currentUser: User;
    isAdmin: boolean;
}

function Users({ currentUser, isAdmin }: UsersProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [loans, setLoans] = useState<Loan[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    useEffect(() => {
        fetchUsers();

        if (!isAdmin) {
            setSelectedUser(currentUser);
            fetchLoans(currentUser.id);
        }
    }, [currentUser, isAdmin]);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/users');

            if (!response.ok) {
                throw new Error('Nepodařilo se načíst čtenáře.');
            }

            const data: User[] = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Chyba při načítání čtenářů:', error);
        }
    };

    const fetchLoans = async (userId: string) => {
        try {
            const response = await fetch(`http://localhost:8080/api/loans/user/${userId}`);

            if (!response.ok) {
                throw new Error('Nepodařilo se načíst výpůjčky.');
            }

            const data: Loan[] = await response.json();
            setLoans(data);
        } catch (error) {
            console.error('Chyba při načítání výpůjček:', error);
            setLoans([]);
        }
    };

    const handleShowLoans = (user: User) => {
        setSelectedUser(user);
        fetchLoans(user.id);
    };

    const handleReturnLoan = async (loanId: number) => {
        try {
            const response = await fetch(`http://localhost:8080/api/loans/${loanId}/return`, {
                method: 'POST'
            });

            if (!response.ok) {
                throw new Error('Nepodařilo se vrátit knihu.');
            }

            const message = await response.text();
            alert(message || 'Kniha byla vrácena.');

            if (selectedUser) {
                fetchLoans(selectedUser.id);
            }
        } catch (error) {
            console.error('Chyba při vrácení knihy:', error);
            alert('Knihu se nepodařilo vrátit.');
        }
    };

    const isOverdue = (loan: Loan) => {
        if (!loan.dueDate || loan.returnDate) {
            return false;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dueDate = new Date(loan.dueDate);
        dueDate.setHours(0, 0, 0, 0);

        return dueDate < today;
    };

    const formatDate = (date?: string | null) => {
        if (!date) {
            return '-';
        }

        return date.substring(0, 10);
    };

    const visibleUsers = isAdmin
        ? users
        : users.filter(user => user.id === currentUser.id);

    return (
        <Box sx={{ p: 2 }}>
            <Typography
                variant="h4"
                gutterBottom
                sx={{
                    fontWeight: 'bold',
                    color: '#5D4037'
                }}
            >
                Správa čtenářů
            </Typography>

            <TableContainer component={Paper} sx={{ boxShadow: 3, mb: 4 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#D7CCC8' }}>
                        <TableRow>
                            <TableCell>
                                <strong>Jméno</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Příjmení</strong>
                            </TableCell>

                            {isAdmin && (
                                <TableCell>
                                    <strong>Email</strong>
                                </TableCell>
                            )}

                            <TableCell align="center">
                                <strong>Akce</strong>
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {visibleUsers.map(user => (
                            <TableRow key={user.id} hover>
                                <TableCell>{user.firstName}</TableCell>
                                <TableCell>{user.lastName}</TableCell>

                                {isAdmin && (
                                    <TableCell>{user.email || '-'}</TableCell>
                                )}

                                <TableCell align="center">
                                    <Button
                                        variant="contained"
                                        size="small"
                                        sx={{
                                            backgroundColor: '#5D4037',
                                            '&:hover': {
                                                backgroundColor: '#4E342E'
                                            }
                                        }}
                                        onClick={() => handleShowLoans(user)}
                                    >
                                        Zobraz výpůjčky
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {selectedUser && (
                <Box
                    sx={{
                        mt: 3,
                        p: 2,
                        backgroundColor: '#FDFCF6',
                        borderTop: '2px solid #5D4037'
                    }}
                >
                    <Typography
                        variant="h5"
                        gutterBottom
                        sx={{
                            color: '#5D4037',
                            fontWeight: 'bold'
                        }}
                    >
                        Výpůjčky: {selectedUser.firstName} {selectedUser.lastName}
                    </Typography>

                    {loans.length === 0 ? (
                        <Typography>
                            Tento čtenář nemá žádné výpůjčky.
                        </Typography>
                    ) : (
                        <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
                            <Table>
                                <TableHead sx={{ backgroundColor: '#EFEBE9' }}>
                                    <TableRow>
                                        <TableCell>
                                            <strong>Kniha</strong>
                                        </TableCell>

                                        <TableCell>
                                            <strong>Půjčeno</strong>
                                        </TableCell>

                                        <TableCell>
                                            <strong>Vrátit do</strong>
                                        </TableCell>

                                        <TableCell>
                                            <strong>Stav</strong>
                                        </TableCell>

                                        <TableCell>
                                            <strong>Pokuta</strong>
                                        </TableCell>

                                        <TableCell align="center">
                                            <strong>Akce</strong>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {loans.map(loan => (
                                        <TableRow key={loan.id} hover>
                                            <TableCell>
                                                {loan.book?.title || 'Neznámá kniha'}
                                            </TableCell>

                                            <TableCell>
                                                {formatDate(loan.loanDate)}
                                            </TableCell>

                                            <TableCell>
                                                {formatDate(loan.dueDate)}
                                            </TableCell>

                                            <TableCell>
                                                {loan.returnDate ? (
                                                    <Chip
                                                        label="Vráceno"
                                                        color="default"
                                                        size="small"
                                                    />
                                                ) : isOverdue(loan) ? (
                                                    <Chip
                                                        label="PO TERMÍNU"
                                                        color="error"
                                                        size="small"
                                                    />
                                                ) : (
                                                    <Chip
                                                        label="V pořádku"
                                                        color="success"
                                                        size="small"
                                                    />
                                                )}
                                            </TableCell>

                                            <TableCell>
                                                {loan.fineAmount && loan.fineAmount > 0
                                                    ? `${loan.fineAmount} Kč`
                                                    : '-'}
                                            </TableCell>

                                            <TableCell align="center">
                                                {!loan.returnDate ? (
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        color={isOverdue(loan) ? 'error' : 'secondary'}
                                                        onClick={() => handleReturnLoan(loan.id)}
                                                    >
                                                        Vrátit
                                                    </Button>
                                                ) : (
                                                    <span>-</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>
            )}
        </Box>
    );
}

export default Users;