import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material'

interface User {
    age: number
    email: string
    firstName: string
    id: string
    lastName: string
    password: string
    username: string
}

interface Book {
    id: number
    title: string
}

function Users() {
    const [usersData, setUsersData] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [books, setBooks] = useState<Book[]>([])

    const columns = ['id', 'firstName', 'lastName', 'email', 'username', 'age']

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true)
            try {
                const response = await fetch('/api/test/users')
                if (!response.ok) throw new Error(`Request failed with status ${response.status}`)
                const data = await response.json()
                setUsersData(Array.isArray(data) ? data : [data])
            } catch (error) {
                setErrorMessage(error instanceof Error ? error.message : 'Unknown error')
            } finally {
                setIsLoading(false)
            }
        }
        void fetchUsers()
    }, [])

    const fetchBooks = async (user: User) => {
        setSelectedUser(user)
        try {
            const response = await fetch(`/api/loans/user/${user.id}`)
            if (!response.ok) throw new Error(`Request failed with status ${response.status}`)
            const data = await response.json()
            setBooks(Array.isArray(data) ? data : [])
        } catch  {
            setBooks([])
        }
    }

    return (
        <div className="page">
            <header className="page-header">
                <h1>Users</h1>
            </header>
            {errorMessage && <div className="error">{errorMessage}</div>}
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell key={column}>{column}</TableCell>
                                ))}
                                <TableCell>Půjčené knihy</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {usersData.map((user) => (
                                <TableRow key={user.id}>
                                    {columns.map((column) => (
                                        <TableCell key={`${user.id}-${column}`}>
                                            {String(user[column as keyof User])}
                                        </TableCell>
                                    ))}
                                    <TableCell>
                                        <Button onClick={() => fetchBooks(user)}>
                                            Zobraz knihy
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {selectedUser && (
                <div style={{ marginTop: '32px' }}>
                    <h2>Půjčené knihy uživatele {selectedUser.firstName}</h2>
                    {books.length === 0 ? (
                        <p>Žádné půjčené knihy</p>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Název</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {books.map((book) => (
                                        <TableRow key={book.id}>
                                            <TableCell>{book.id}</TableCell>
                                            <TableCell>{book.title}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </div>
            )}
        </div>
    )
}

export default Users