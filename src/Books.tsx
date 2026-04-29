import { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Button, Typography, Box, TextField, Chip
} from '@mui/material';

interface Book {
    id: number;
    title: string;
    isbn: string;
    author?: { name: string };
    loaned?: boolean;
}

interface User {
    id: string;
    firstName: string;
    lastName: string;
}

interface BooksProps {
    isAdmin: boolean;
    currentUserId: string;
}

const Books = ({ isAdmin, currentUserId }: BooksProps) => {
    const [books, setBooks] = useState<Book[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
    const [newTitle, setNewTitle] = useState('');
    const [newAuthor, setNewAuthor] = useState('');
    const [search, setSearch] = useState('');

    const fetchBooks = () => {
        fetch('http://localhost:8080/api/books')
            .then(res => res.json())
            .then(data => setBooks(data))
            .catch(err => console.error(err));
    };

    const fetchUsers = () => {
        fetch('http://localhost:8080/api/users')
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchBooks();
        fetchUsers();
    }, []);

    const handleAddBook = async () => {
        if (!newTitle || !newAuthor) {
            alert('Vyplňte název knihy a autora!');
            return;
        }
        await fetch('http://localhost:8080/api/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newTitle, authorName: newAuthor })
        });
        setNewTitle('');
        setNewAuthor('');
        fetchBooks();
    };

    const handleLoan = async (userId: string) => {
        if (selectedBookId) {
            await fetch(`http://localhost:8080/api/books/${selectedBookId}/loan/${userId}`, {
                method: 'POST'
            });
            setSelectedBookId(null);
            fetchBooks();
        }
    };

    const handlePujcit = (bookId: number) => {
        if (isAdmin) {
            setSelectedBookId(bookId);
        } else {
            handleLoanDirect(bookId, currentUserId);
        }
    };

    const handleLoanDirect = async (bookId: number, userId: string) => {
        await fetch(`http://localhost:8080/api/books/${bookId}/loan/${userId}`, {
            method: 'POST'
        });
        alert('Kniha byla úspěšně půjčena!');
        fetchBooks();
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Opravdu chcete tuto knihu smazat?')) {
            await fetch(`http://localhost:8080/api/books/${id}`, { method: 'DELETE' });
            fetchBooks();
        }
    };

    const filteredBooks = books
        .filter(book =>
            book.title.toLowerCase().includes(search.toLowerCase()) ||
            (book.author?.name ?? '').toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => a.title.localeCompare(b.title, 'cs'));

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#5D4037' }}>
                Katalog knih
            </Typography>

            {isAdmin && (
                <Box sx={{ mb: 3, p: 2, backgroundColor: '#FDFCF6', borderRadius: 2, display: 'flex', gap: 2, alignItems: 'center', boxShadow: 1 }}>
                    <TextField label="Název knihy" size="small" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                    <TextField label="Autor" size="small" value={newAuthor} onChange={(e) => setNewAuthor(e.target.value)} />
                    <Button variant="contained" onClick={handleAddBook} sx={{ backgroundColor: '#5D4037', '&:hover': { backgroundColor: '#4E342E' } }}>
                        Přidat knihu
                    </Button>
                </Box>
            )}

            <Box sx={{ mb: 2 }}>
                <TextField
                    fullWidth
                    label="Vyhledat knihu nebo autora..."
                    size="small"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </Box>

            <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#D7CCC8' }}>
                        <TableRow>
                            <TableCell><strong>Název</strong></TableCell>
                            <TableCell><strong>Autor</strong></TableCell>
                            <TableCell><strong>Stav</strong></TableCell>
                            <TableCell align="center"><strong>Akce</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredBooks.map((book) => (
                            <TableRow key={book.id} hover>
                                <TableCell>{book.title}</TableCell>
                                <TableCell>{book.author ? book.author.name : 'Neznámý'}</TableCell>
                                <TableCell>
                                    {book.loaned
                                        ? <Chip label="ZAPŮJČENO" color="error" size="small" />
                                        : <Chip label="Dostupná" color="success" size="small" />
                                    }
                                </TableCell>
                                <TableCell align="center">
                                    <Button
                                        variant="contained"
                                        size="small"
                                        disabled={book.loaned}
                                        sx={{ mr: 1, backgroundColor: '#5D4037', '&:hover': { backgroundColor: '#4E342E' } }}
                                        onClick={() => handlePujcit(book.id)}
                                    >
                                        Půjčit
                                    </Button>
                                    {isAdmin && (
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            onClick={() => handleDelete(book.id)}
                                        >
                                            Smazat
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {selectedBookId && isAdmin && (
                <Box sx={{ mt: 4, p: 2, backgroundColor: '#EFEBE9', borderRadius: 2, border: '1px solid #D7CCC8' }}>
                    <Typography variant="h6" sx={{ color: '#5D4037', mb: 1 }}>Vyberte čtenáře pro výpůjčku:</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {users.map(u => (
                            <Button
                                key={u.id}
                                variant="outlined"
                                sx={{ borderColor: '#5D4037', color: '#5D4037' }}
                                onClick={() => handleLoan(u.id)}
                            >
                                {u.firstName} {u.lastName}
                            </Button>
                        ))}
                        <Button onClick={() => setSelectedBookId(null)} color="secondary" sx={{ ml: 'auto' }}>
                            Zrušit
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default Books;