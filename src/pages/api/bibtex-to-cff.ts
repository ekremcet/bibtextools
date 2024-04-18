import type {NextApiRequest, NextApiResponse} from "next"
import multer from 'multer'
import {extractAuthors, ParseBibtex} from "@/lib/parseUtils"
import {bibToCff} from "@/lib/cffUtils";

// Configure multer with memory storage
const upload = multer({storage: multer.memoryStorage()});

// Custom middleware to handle multer file upload
const uploadMiddleware = upload.none();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    // @ts-ignore
    uploadMiddleware(req, res, async (error: any) => {
        if (error instanceof Error) {
            return res.status(500).json({error: error.message});
        }

        try {
            console.log("Starting BibTeX to CFF conversion")
            const bibTex = req.body.bibTex;
            console.log(bibTex)
            const bibJSON = ParseBibtex(bibTex)
            console.log("BibTeX parsed:\n", bibJSON)
            // @ts-ignore
            const authors = extractAuthors(bibJSON.author)
            console.log("Authors extracted:\n", authors)
            const cffEntry = bibToCff(bibJSON, authors);
            console.log("CFF entry generated:\n", cffEntry)
            res.setHeader('Content-Type', 'application/x-yaml');
            res.setHeader('Content-Disposition', 'attachment; filename="CITATION.cff"');
            res.send(cffEntry);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({error: `Error processing the file: ${error.message}`});
            } else {
                res.status(500).json({error: "Error processing the file"});
            }
        }
    });
};

export const config = {
    api: {
        bodyParser: false
    }
};

export default handler