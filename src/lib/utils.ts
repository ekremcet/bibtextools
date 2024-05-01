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
        authorList = `${authors[0].lastName}, ${authors[0].firstName}, et al. `;
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

export function bibToApa(bibJSON: BibJSON, authors: Author[]): string {
    let authorList = "";
    authors.forEach((author, index) => {
        const nameParts = author.firstName.split(" ");
        const initials = nameParts.map(part => part.charAt(0));
        const initialsString = initials.join(". ");

        if (index === authors.length - 1) {
            // add & before the last author
            authorList += " & ";
        } else if (index === 6 && authors.length > 7) {
            // if there are more than 6 authors, add ... after the 6th author for each subsequent author
            authorList += ", ... ";
            return;
        } else if (index > 0){
            authorList += "., ";
        }

        authorList += `${author.lastName}, ${initialsString}`;
    });

    let venue = "";
    if (bibJSON.journal) {
        venue = bibJSON.journal;
    } else if (bibJSON.booktitle) {
        venue = bibJSON.booktitle;
    }

    return `${authorList} (${bibJSON.year}). ${bibJSON.title}. In ${venue} (pp. ${bibJSON.pages}).`;
}