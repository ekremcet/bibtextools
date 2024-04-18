export interface BibEntry {
    [key: string]: string
}

export interface BibJSON {
    type?: string;
    title?: string;
    author?: string;
    year?: string;
    isbn?: string;
    publisher?: string;
    address?: string;
    url?: string;
    doi?: string;
    abstract?: string;
    booktitle?: string;
    pages?: string;
    numpages?: string;
    keywords?: string;
    location?: string;
    series?: string;
}

export interface Author {
    firstName: string
    lastName: string
}