import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {Author, BibJSON} from "@/types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function bibToMLA(bibJSON: BibJSON, authors: Author[]): string {
    let authorList = "";
    if (authors.length >= 2) {
        // return first author's last name followed by "et al."
        authorList =  `${authors[0].lastName}, ${authors[0].firstName}, et al. `;
    } else {
        authorList = `${authors[0].lastName}, ${authors[0].firstName}`;
    }

    let venue = "";
    if (bibJSON.journal) {
        venue = bibJSON.journal;
    } else if (bibJSON.booktitle) {
        venue = bibJSON.booktitle;
    }

    return `${authorList} "${bibJSON.title}." ${venue} (${bibJSON.year}): ${bibJSON.pages}.`;
}