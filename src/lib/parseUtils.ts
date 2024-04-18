import {normalizeFieldValue, parseBibFile} from "bibtex";
import {Author, BibJSON} from "@/types";

export function normalizeLaTeXChars(string: string): string {
    // replace LaTeX special characters with their Unicode equivalents
    return string
        .replace(/\\'([A-Za-z])/g, (_, char) => char + '́')  // Acute accent
        .replace(/\\`([A-Za-z])/g, (_, char) => char + '̀')  // Grave accent
        .replace(/\\\^([A-Za-z])/g, (_, char) => char + '̂')  // Circumflex
        .replace(/\\~([A-Za-z])/g, (_, char) => char + '̃')  // Tilde
        .replace(/\\c\{([A-Za-z])\}/g, (_, char) => char + '̧')  // Cedilla
        .replace(/\\v\{([A-Za-z])\}/g, (_, char) => char + '̌')  // Caron
        .replace(/\\u\{([A-Za-z])\}/g, (_, char) => char + '̆')  // Breve
        .replace(/\\=\{([A-Za-z])\}/g, (_, char) => char + '̄')  // Macron
        .replace(/\\\.([A-Za-z])/g, (_, char) => char + '̇')  // Dot above
        .replace(/\\\"([A-Za-z])/g, (_, char) => char + '̈')  // Diaeresis
        .replace(/\\H\{([A-Za-z])\}/g, (_, char) => char + '̋')  // Double acute accent
        .replace(/\\c{C}/g, 'Ç')
        .replace(/\\c{S}/g, 'Ş')
        .replace(/\\c{c}/g, 'ç')
        .replace(/\\c{s}/g, 'ş')
        .replace(/\\ae/g, 'æ')
        .replace(/\\AE/g, 'Æ')
        .replace(/\\oe/g, 'œ')
        .replace(/\\OE/g, 'Œ')
        .replace(/\\aa/g, 'å')
        .replace(/\\AA/g, 'Å')
        .replace(/\\o/g, 'ø')
        .replace(/\\O/g, 'Ø');
}

interface TypeMatch {
    [key: string]: string
}

function convertType(type: string): string {
    // convert bibtex type to cff type
    const type_dict: TypeMatch = {
        "article": "article-journal",
        "book": "book",
        "booklet": "pamphlet",
        "inproceedings": "conference-paper",
        "proceedings": "conference",
        "misc": "generic",
        "manual": "manual",
        "software": "software",
        "techreport": "report",
        "unpublished": "unpublished"
    }

    return type_dict[type] || "generic"
}

export function ParseBibtex(bibtex: string): BibJSON {
    const bibJSON: BibJSON = {} as BibJSON
    const normalizedBibtex = normalizeLaTeXChars(bibtex)
    const bibFile = parseBibFile(normalizedBibtex)
    const bibEntries = bibFile.entries_raw
    // if there are more than one entry, throw error
    if (bibEntries.length > 1) {
        throw new Error("Only one entry is allowed in the BibTeX file.")
    }
    const bibEntry = bibEntries[0]
    const type = convertType(bibEntry.type)

    for (const key in bibEntry.fields) {
        const entryKey = key as string
        // @ts-ignore
        bibJSON[entryKey] = normalizeFieldValue(bibEntry.fields[key])
    }
    // add publication type
    bibJSON.type = type

    return bibJSON
}

export function extractAuthors(authorString: string): { firstName: string, lastName: string }[] {
    const authors = authorString.split(/ and |, /)
    const parsedAuthors: Author[] = [];

    for (let i = 0; i < authors.length; i++) {
        if (i % 2 === 0) {
            if (authors[i + 1]) {
                parsedAuthors.push({
                    lastName: authors[i].trim(),
                    firstName: authors[i + 1].trim()
                });
            }
        }
    }

    return parsedAuthors
}