import * as React from 'react';
import { useState, useContext } from 'react'
import AuthContext from '../../auth';
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
// import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import { Link, useNavigate } from "react-router-dom";
import { CardHeader, CardContent } from '@mui/material';
import backgroundImage from '../images/login-background.png';
import axios from 'axios';
import blankMapicon from '../images/logo_clear.png';
import { Card, Text, Button } from '@radix-ui/themes';

export default function LoginScreen() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate()
    const { auth } = useContext(AuthContext);
    const [error, setError] = useState(null)

    async function handleLogin(event) {
        if (username === "" ||
            password === "") {
            setError("Please fill all fields");
            return;
        }
        await auth.loginUser(username, password).then(function (res) {
            setError(null)
        }).catch(function (res) {
            console.log(res)
            setError(res.errorMessage)
        })


        // https://blankmap-server-6de6d45e4291.herokuapp.com:5000/api/users // http://localhost:8000/api/users

    }
    async function handleGuest(event) {
        await auth.guestLogin();
    }
    return (
        <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{
                height: 'calc(94.7vh )',
                background: `url(${backgroundImage}) center/cover no-repeat fixed`,
                padding: '20px', // Adjust padding as needed
                boxSizing: 'border-box',
            }}
        >
            <Grid item xs={12} sm={8} md={8} lg={4} style={{ minWidth: '500px' }}>
                <Card>
                    {/* <CardHeader color="blue"
                            title={<Typography noWrap sx={{textAlign: "center", fontWeight: "bold",  overflow: "hidden", textOverflow: "ellipsis"}}>LOGIN</Typography>}
                            sx = {{bgcolor:"CornflowerBlue"}}
                            /> */}
                    <CardContent onSubmit={handleLogin} sx={{ paddingY: 3, alignItems: "center" }}>
                        <Box>
                            {/* <Box sx={{ display: 'flex', flexGrow: 1, paddingX: '60px' }}>
                                <img src={blankMapicon} alt="fireSpot" width="60" height="60" />
                            </Box> */}
                            <Box sx={{ display: 'flex', flexGrow: 1, paddingX: '60px', paddingY: 4 }}>
                                <span style={{ fontWeight: 'bold', fontSize: '1.4em' }}>Log in</span>
                            </Box >
                            <Box sx={{ display: 'flex', flexGrow: 1, paddingX: "60px" }}>
                                Username
                            </Box>
                            <Box sx={{ display: 'flex', flexGrow: 1, paddingX: "60px", marginTop: '3px', marginBottom: "8px", alignItems: 'center', justifyContent: 'center' }}>
                                {/* <AccountCircle sx = {{padding:1}}/> */}
                                <TextField id="username" onChange={(e) => setUsername(e.target.value)} fullWidth />
                            </Box>
                            <Box sx={{ display: 'flex', flexGrow: 1, paddingX: "60px", marginTop: "20px" }}>
                                Password
                                <Link to="/forgot" style={{ marginLeft: 'auto' }}>Forgot Password</Link>
                            </Box>
                            <Box sx={{ display: 'flex', flexGrow: 1, paddingX: '60px', marginTop: '3px', marginBottom: '3px', alignItems: 'center', justifyContent: 'center' }}>
                                {/* <LockIcon sx={{ padding: 1 }} /> */}
                                <TextField
                                    id="password"
                                    type="password" // Set the type to "password" to display asterisks
                                    onChange={(e) => setPassword(e.target.value)}
                                    fullWidth
                                />
                            </Box>
                            <Box sx={{ display: 'flex', flexGrow: 1, paddingX: '60px', paddingY: 3, alignItems: 'center', justifyContent: 'center' }}>
                                <Button asChild href="#" id='login'  onClick={handleLogin}>
                                <a href="#">Log in</a>
                                </Button>

                            </Box>


                            <Box sx={{ display: 'flex', flexGrow: 1, paddingX: "60px", marginBottom: "20px" }}>
                                <Link onClick={handleGuest}>Guest Login</Link>
                            </Box>
                            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                            <Box sx={{ display: 'flex', flexGrow: 1, paddingX: "60px", paddingY: 1, alignItems: 'center', justifyContent: 'center' }}>
                                Don't have an account?
                                <Link to="/register">Register Account</Link>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

        </Grid>
    );
}