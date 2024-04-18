import {Author, BibJSON} from "@/types"
import yaml from "js-yaml"

function prepareAuthors(authors: Author[]): any {
    // convert authors to cff format
    return authors.map(author => ({
        "family-names": author.lastName,
        "given-names": author.firstName
    }));
}

export function bibToCff(bibEntry: BibJSON, authors: Author[]): string {
    const cffAuthors = prepareAuthors(authors)
    const currentDate = new Date();
    const releaseDate = new Date(Number(bibEntry.year), currentDate.getMonth(), currentDate.getDate()).toISOString().split('T')[0];
    const cffEntry = {
        "cff-version": "1.2.0",
        message: "If you use this software, please cite both the article from preferred-citation and the software itself.",
        authors: cffAuthors,
        title: bibEntry.title,
        version: "1.0.0",
        url: bibEntry.url,
        doi: bibEntry.doi,
        "date-released": releaseDate,
        "preferred-citation": {
            authors: cffAuthors,
            title: bibEntry.title,
            doi: bibEntry.doi,
            url: bibEntry.url,
            type: bibEntry.type,
            pages: bibEntry.pages,
            year: bibEntry.year,
            isbn: bibEntry.isbn,
            "collection-title": bibEntry.booktitle,
            conference: {
                name: bibEntry.series
            },
            publisher: {
                name: bibEntry.publisher,
                address: bibEntry.address
            }
        }
    };
    return yaml.dump(cffEntry, {
        lineWidth: -1,  // Prevent wrapping of long strings
        noRefs: true    // Disable the use of references
    });
}