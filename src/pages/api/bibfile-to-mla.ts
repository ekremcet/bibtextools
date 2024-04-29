import type {NextApiRequest, NextApiResponse} from "next"
import multer from 'multer'
import {extractAuthors, ParseBibtex} from "@/lib/parseUtils"
import {bibToMLA} from "@/lib/utils";

// Configure multer with memory storage
const upload = multer({storage: multer.memoryStorage()});

// Custom middleware to handle multer file upload
const uploadMiddleware = upload.single('bibtexFile');

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    //@ts-ignore: Object is possibly 'undefined'.
    uploadMiddleware(req, res, async (error: any) => {
        if (error) {
            return res.status(500).json({error: error.message});
        }

        // @ts-ignore: Object is possibly 'undefined'.
        const file = req.file;
        if (!file) {
            return res.status(400).json({error: 'No file uploaded.'});
        }

        try {
            const bibtexData = file.buffer.toString("utf-8")
            const bibJSON = ParseBibtex(bibtexData)
            // @ts-ignore
            const authors = extractAuthors(bibJSON.author)

            const mlaText = bibToMLA(bibJSON, authors)

            // send the response as JSON
            res.json({mlaText: mlaText, status: 'success'})

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
