import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react';
import './App.css';
import {Container, Navbar} from "react-bootstrap";
import {SearchBar} from "./components/SearchBar";

function App() {
    return (
        <div>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand href="#">SynoSearch</Navbar.Brand>
                </Container>
            </Navbar>

            <SearchBar/>
        </div>
    );
}

export default App;
