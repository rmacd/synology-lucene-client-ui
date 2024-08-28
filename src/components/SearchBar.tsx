import React from 'react';
import {SearchResults} from "./SynoTypes";
import {Button, Col, Container, Form, FormControl, InputGroup, ListGroup, Offcanvas, Row} from "react-bootstrap";
import axios from "axios";

import {Document, Page} from 'react-pdf'
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import {filesize} from "filesize";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const SearchBar = () => {

    const [query, setQuery] = React.useState('');
    const [results, setResults] = React.useState<SearchResults>({
        hits: [],
        total_hits: 0,
    });
    const [showPreview, setShowPreview] = React.useState(false);
    const [selectedDoc, setSelectedDoc] = React.useState<string>('');
    const [numPages, setNumPages] = React.useState(0);

    const handleClose = () => {
        setShowPreview(false);
        setSelectedDoc('');
    }

    const handlePreview = (path: string) => {
        setShowPreview(true);
        setSelectedDoc(`/get?p=${encodeURIComponent(path)}`);
    }

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    }

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await axios.get(`/search`, {
            params: {
                q: query
            }
        });
        setResults(response.data);
    }

    return (
        <>

            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col md={12}>
                        <Form onSubmit={handleSearch}>
                            <InputGroup size="lg">
                                <FormControl
                                    type="search"
                                    placeholder="Enter search terms..."
                                    aria-label="Search"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                <Button variant="primary" type="submit">
                                    Search
                                </Button>
                            </InputGroup>
                        </Form>
                    </Col>
                </Row>

                <Row className="mt-4">
                    <Col md={12}>
                        {results.total_hits > 0 ? (
                            <Row className="mt-4">
                                {results.total_hits > 0 ? (
                                    <ListGroup>
                                        {results.hits.map((result, index) => (
                                            <ListGroup.Item key={index} action onClick={() => handlePreview(result.path)}>
                                                <strong>Score:</strong> {result.score} <br />
                                                <strong>Path:</strong> {result.path} <br />
                                                <strong>Size:</strong> {filesize(result.fs_size)} <br />
                                                <strong>Ext:</strong> {result.extension}
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                ) : (
                                    query && <p>No results found</p>
                                )}
                            </Row>
                        ) : (
                            query && <p>No results found</p>
                        )}
                    </Col>
                </Row>
            </Container>

            <Offcanvas show={showPreview} onHide={handleClose} placement="end" style={{width: '50%'}}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Document Preview</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {selectedDoc && (
                        <div>
                            <Document file={selectedDoc} onLoadSuccess={onDocumentLoadSuccess}>
                                {Array.from(
                                    new Array(numPages),
                                    (el, index) => (
                                        <Page
                                            key={`page_${index + 1}`}
                                            pageNumber={index + 1}
                                        />
                                    ),
                                )}
                            </Document>
                        </div>
                    )}
                </Offcanvas.Body>
            </Offcanvas>
        </>
    )
}
