'use client';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { useState } from 'react';

export default function MyApp() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [showFirstPage, setShowFirstPage] = useState(true);
    const [showRegister, setShowRegister] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showStudentShare, setShowStudentShare] = useState(false);
    const [showMapApi, setShowMapApi] = useState(false);
    const [showReviews, setShowReviews] = useState(false);
    const [showRent, setShowRent] = useState(false);
    const [showContact, setShowContact] = useState(false);
    const [username, setUsername] = useState('');
    const [studentShareRegistered, setStudentShareRegistered] = useState(false);

    const resetPages = () => {
        setShowFirstPage(false);
        setShowRegister(false);
        setShowLogin(false);
        setShowStudentShare(false);
        setShowMapApi(false);
        setShowReviews(false);
        setShowRent(false);
        setShowContact(false);
    };

    const runShowFirst = () => {
        resetPages();
        setShowFirstPage(true);
    };

    const runShowRegister = () => {
        resetPages();
        setShowRegister(true);
    };

    const runShowLogin = () => {
        resetPages();
        setShowLogin(true);
    };

    const runShowStudentShare = () => {
        if (!loggedIn) {
            alert('Please log in to access Student Share.');
            resetPages();
            setShowLogin(true);
            return;
        }
    
        resetPages();
        setShowStudentShare(true);
    
        // If user is not registered for Student Share, show the registration form first
        if (!studentShareRegistered) {
            setShowRegister(true);
        } else {
            setShowStudentShare(true);
        }
    };
    const runShowMapApi = () => {
        resetPages();
        setShowMapApi(true);
    };

    const runShowReviews = () => {
        resetPages();
        setShowReviews(true);
    };

    const runShowRent = () => {
        resetPages();
        setShowRent(true);
    };

    const runShowContact = () => {
        resetPages();
        setShowContact(true);
    };

    const handleLogin = () => {
        const email = document.querySelector('input[name="email"]').value;
        const password = document.querySelector('input[name="password"]').value;

        fetch('/api/carlogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert('Login successful!');
                    setLoggedIn(true);
                    setUsername(data.username);
                    
                    // Check if user is registered for Student Share
                    fetch(`/api/studentshare?email=${data.username}`)
                    .then((res) => res.json())
                    .then((studentShareData) => {
                        if (studentShareData.registered) {
                            setStudentShareRegistered(true);
                        } else {
                            setStudentShareRegistered(false);
                        }
                    })
                    .catch((err) => console.error('Error checking Student Share registration:', err));

                resetPages();
                setShowStudentShare(true);
            }
        })
        .catch((err) => console.error('Error during login:', err));
};
    const handleLogout = () => {
        setLoggedIn(false);
        setUsername('');
        alert('You have been logged out.');
        runShowFirst();  // Redirect to the home page after logout
    };
    const handleStudentShareRegister = () => {
        const studentID = document.querySelector('input[name="studentID"]').value;
        const drivingLicense = document.querySelector('input[name="drivingLicense"]').value;
    
        if (!username || !loggedIn) {
            alert("You must be logged in to register for Student Share.");
            return;
        }
    
        if (!studentID || !drivingLicense) {
            alert("Please enter both Student ID and Driving License Number.");
            return;
        }
    
        fetch('/api/studentshare', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: username, email: username, studentID, drivingLicense }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Server error: ${res.status}`);
                }
                return res.text(); // Read response as text to handle empty responses
            })
            .then((text) => {
                if (!text) {
                    throw new Error("Empty response from the server.");
                }
                return JSON.parse(text);
            })
            .then((data) => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert('You have successfully registered for Student Share!');
                    setStudentShareRegistered(true);
    
                    resetPages();
                    setShowStudentShare(true);
                }
            })
            .catch((err) => console.error('Error during Student Share registration:', err));
    };
    

    return (
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: '#2E3B4E',
                color: 'lightgreen',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <AppBar
                position="static"
                sx={{
                    backgroundColor: 'lightgreen',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Toolbar>
                <Typography variant="h4" component="div" sx={{ flexGrow: 1, color: '#2E3B4E', fontWeight: 'bold' }}>
            Eco Wheels Dublin
        </Typography>
        <Button color="inherit" sx={{ fontWeight: 'bold' }} onClick={runShowFirst}>
            Home
        </Button>
        {!loggedIn && (
            <>
                <Button color="inherit" sx={{ fontWeight: 'bold' }} onClick={runShowRegister}>
                    Register
                </Button>
                <Button color="inherit" sx={{ fontWeight: 'bold' }} onClick={runShowLogin}>
                    Login
                </Button>
            </>
        )}
        {loggedIn && (
            <Button color="inherit" sx={{ fontWeight: 'bold' }} onClick={handleLogout}>
                Logout
            </Button>
        )}
        <Button color="inherit" sx={{ fontWeight: 'bold' }} onClick={runShowStudentShare}>
            Student Share
                    </Button>
                    <Button color="inherit" sx={{ fontWeight: 'bold' }} onClick={runShowMapApi}>
                        Map API
                    </Button>
                    <Button color="inherit" sx={{ fontWeight: 'bold' }} onClick={runShowReviews}>
                        Reviews
                    </Button>
                    <Button color="inherit" sx={{ fontWeight: 'bold' }} onClick={runShowRent}>
                        Rent
                    </Button>
                    <Button color="inherit" sx={{ fontWeight: 'bold' }} onClick={runShowContact}>
                        Contact
                    </Button>
                </Toolbar>
            </AppBar>

            {showFirstPage && (
                <Box
                    sx={{
                        p: 4,
                        textAlign: 'center',
                        border: '1px dashed grey',
                        margin: '20px',
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    }}
                >
                    <Typography variant="h3" sx={{ color: '#2E3B4E', fontWeight: 'bold', mb: 2 }}>
                        Welcome to Eco Wheels Dublin 
                    </Typography>
                    {loggedIn && (
            <Typography variant="h5" sx={{ mt: 1, color: '#2E3B4E' }}>
                Hello, {username}!
            </Typography>
        )}
                    <Typography variant="h5" sx={{ mt: 2, color: '#2E3B4E', mb: 4 }}>
                        Rent your eco-friendly car today!
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: 2,
                        }}
                    >
                        <Box
                            sx={{
                                width: '300px',
                                backgroundColor: '#f5f5f5',
                                borderRadius: '10px',
                                overflow: 'hidden',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            }}
                        >
                            <img
                                src="https://changinglanes.ie/wp-content/uploads/2024/01/BYD-SEAL-1-scaled.jpg"
                                alt="Electric Car 1"
                                style={{ width: '100%', height: 'auto' }}
                            />
                            <Typography sx={{ p: 2, fontWeight: 'bold', color: '#2E3B4E' }}>
                                Affordable Rentals
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                width: '300px',
                                backgroundColor: '#f5f5f5',
                                borderRadius: '10px',
                                overflow: 'hidden',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            }}
                        >
                            <img
                                src="https://c.ndtvimg.com/2021-11/1316no38_mg-zs-ev_625x300_26_November_21.jpg"
                                alt="Electric Car 2"
                                style={{ width: '100%', height: 'auto' }}
                            />
                            <Typography sx={{ p: 2, fontWeight: 'bold', color: '#2E3B4E' }}>
                                Eco-Friendly Fleet
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                width: '300px',
                                backgroundColor: '#f5f5f5',
                                borderRadius: '10px',
                                overflow: 'hidden',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            }}
                        >
                            <img
                                src="https://www.drivenation.ca/images/ckfinder/DRISAS_impactofelectriccars.jpg"
                                alt="Electric Car 3"
                                style={{ width: '100%', height: 'auto' }}
                            />
                            <Typography sx={{ p: 2, fontWeight: 'bold', color: '#2E3B4E' }}>
                                Convenient Locations
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ mt: 4 }}>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#2E3B4E',
                                color: 'white',
                                ':hover': {
                                    backgroundColor: '#4C5E72',
                                },
                            }}
                            onClick={() => {
                                if (loggedIn) {
                                    runShowRent();
                                } else {
                                    alert('Please log in to explore rental options.');
                                    runShowLogin(); 
                                }
                            }}
                        >
                            Explore Rental Options
                        </Button>
                    </Box>
                </Box>
            )}

            {showRegister && (
                <Box
                    sx={{
                        p: 4,
                        border: '1px dashed grey',
                        margin: '20px',
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    }}
                >
                    <Typography variant="h3" sx={{ color: '#2E3B4E', fontWeight: 'bold' }}>
                        Register
                    </Typography>
                    <FormControl sx={{ mt: 2, mb: 2 }}>
                        <FormLabel>Name</FormLabel>
                        <Input name="name" type="text" placeholder="Enter your name" />
                    </FormControl>
                    <FormControl sx={{ mt: 2, mb: 2 }}>
                        <FormLabel>Address</FormLabel>
                        <Input name="address" type="text" placeholder="Enter your address" />
                    </FormControl>
                    <FormControl sx={{ mt: 2, mb: 2 }}>
                        <FormLabel>Email</FormLabel>
                        <Input name="email" type="email" placeholder="Enter your email" />
                    </FormControl>
                    <FormControl sx={{ mt: 2, mb: 2 }}>
                        <FormLabel>Password</FormLabel>
                        <Input name="password" type="password" placeholder="Enter your password" />
                    </FormControl>
                    <FormControl sx={{ mt: 2, mb: 2 }}>
                        <FormLabel>Confirm Password</FormLabel>
                        <Input name="confirm-password" type="password" placeholder="Confirm your password" />
                    </FormControl>
                    <Button
                        variant="contained"
                        sx={{
                            mt: 3,
                            backgroundColor: '#2E3B4E',
                            color: 'white',
                            ':hover': {
                                backgroundColor: '#4C5E72',
                            },
                        }}
                        onClick={handleRegister}
                    >
                        Register
                    </Button>
                </Box>
            )}

            {showLogin && (
                <Box
                    sx={{
                        p: 4,
                        border: '1px dashed grey',
                        margin: '20px',
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    }}
                >
                    <Typography variant="h3" sx={{ color: '#2E3B4E', fontWeight: 'bold' }}>
                        Login
                    </Typography>
                    <FormControl sx={{ mt: 2, mb: 2 }}>
                        <FormLabel>Email</FormLabel>
                        <Input name="email" type="email" placeholder="Enter your email" />
                    </FormControl>
                    <FormControl sx={{ mt: 2, mb: 2 }}>
                        <FormLabel>Password</FormLabel>
                        <Input name="password" type="password" placeholder="Enter your password" />
                    </FormControl>
                    <Button
                        variant="contained"
                        sx={{
                            mt: 3,
                            backgroundColor: '#2E3B4E',
                            color: 'white',
                            ':hover': {
                                backgroundColor: '#4C5E72',
                            },
                        }}
                        onClick={handleLogin}
                    >
                        Login
                    </Button>
                </Box>
            )}

{showStudentShare && (
    <Box
        sx={{
            p: 4,
            textAlign: 'center',
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            minHeight: '500px' // Ensure it takes up space
        }}
    >
        {!studentShareRegistered ? (
            <>
                <Typography variant="h3" sx={{ color: '#2E3B4E', fontWeight: 'bold' }}>
                    Student Share Registration
                </Typography>
                <Typography sx={{ color: '#2E3B4E', mb: 2 }}>
                    Please register for Student Share before accessing shared cars.
                </Typography>
                
                <FormControl sx={{ mt: 2, mb: 2 }}>
                    <FormLabel>Student ID</FormLabel>
                    <Input name="studentID" type="text" placeholder="Enter your Student ID" required />
                </FormControl>
                <FormControl sx={{ mt: 2, mb: 2 }}>
                    <FormLabel>Driving License Number</FormLabel>
                    <Input name="drivingLicense" type="text" placeholder="Enter your License Number" required />
                </FormControl>
                <Button
                    variant="contained"
                    sx={{
                        mt: 3,
                        backgroundColor: '#2E3B4E',
                        color: 'white',
                        ':hover': {
                            backgroundColor: '#4C5E72',
                        },
                    }}
                    onClick={handleStudentShareRegister}
                >
                    Register for Student Share
                </Button>
            </>
        ) : (
            <>
                <Typography variant="h3">Student Share</Typography>
                <Typography>Welcome to Student Share! You can now share and rent cars.</Typography>
            </>
        )}
    </Box>
)}

            {showMapApi && (
                <Box sx={{ p: 4, textAlign: 'center', backgroundColor: 'white', borderRadius: '10px' }}>
                    <Typography variant="h3">Map API</Typography>
                    <Typography>Page under construction</Typography>
                </Box>
            )}

            {showReviews && (
                <Box sx={{ p: 4, textAlign: 'center', backgroundColor: 'white', borderRadius: '10px' }}>
                    <Typography variant="h3">Reviews</Typography>
                    <Typography>Page under construction</Typography>
                </Box>
            )}

            {showRent && (
                <Box sx={{ p: 4, textAlign: 'center', backgroundColor: 'white', borderRadius: '10px' }}>
                    <Typography variant="h3">Rent</Typography>
                    <Typography>Page under construction</Typography>
                </Box>
            )}

            {showContact && (
                <Box sx={{ p: 4, textAlign: 'center', backgroundColor: 'white', borderRadius: '10px' }}>
                    <Typography variant="h3">Contact</Typography>
                    <Typography>Page under construction</Typography>
                </Box>
            )}
        </Box>
    );
}
