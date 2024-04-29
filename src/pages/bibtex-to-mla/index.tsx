import {Button} from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea";
import React, {ChangeEvent, useState} from "react";
import {LoaderCircle} from "lucide-react";
import {extractAuthors, ParseBibtex} from "@/lib/parseUtils";
import {bibToMLA} from "@/lib/utils";
import {useToast} from "@/components/ui/use-toast";
import {Toaster} from "@/components/ui/toaster";

export default function BibtexToMla() {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [bibFile, setBibFile] = useState<File | null>(null)
    const [bibTex, setBibTex] = useState<string>("")
    const [mla, setMla] = useState<string>("")
    // to force re-render of input field
    const [inputKey, setInputKey] = useState<string>(Date.now().toString())

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setBibFile(event.target.files[0])
        }
        setBibTex("")
    };

    const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setBibTex(event.target.value)
        setBibFile(null)
        setInputKey(Date.now().toString())
    };

    const isBibtexLengthValid = bibTex.length > 0
    const isButtonEnabled = (bibFile && !isBibtexLengthValid) || (!bibFile && isBibtexLengthValid)

    const handleSubmit = async (event: React.FormEvent<EventTarget>) => {
        setIsLoading(true)
        event.preventDefault();
        let formData = new FormData()
        let apiPath = ""

        if (isBibtexLengthValid) {
            const bibJSON = ParseBibtex(bibTex)
            // @ts-ignore
            const authors = extractAuthors(bibJSON.author)
            const mlaText = bibToMLA(bibJSON, authors)
            setMla(mlaText)
            setIsLoading(false)

            return

        } else if (bibFile !== null) {
            formData.append('bibtexFile', bibFile as Blob)
            apiPath = '/api/bibfile-to-mla'
        } else {
            alert('Please provide a BibTeX file or paste BibTeX')
        }

        const response = await fetch(apiPath, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const data = await response.json()
            setMla(data.mlaText)
        } else {
            alert('Failed to convert BibTex to CFF');
        }
        setIsLoading(false);
    };

    return (
        <div className="main-content grid grid-rows-3 justify-center items-center min-h-screen min-w-screen">
            <Card className="w-[700px] row-span-2">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">BibTeX to MLA Converter</CardTitle>
                    <CardDescription>
                        Convert BibTex format to MLA format for text-based citations
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="bibFile">Bib File</Label>
                            <Input id="bibFile" type="file" name="bibFile" onChange={handleFileChange} key={inputKey}/>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t"/>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Or paste BibTeX below
                                </span>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="bibTex">BibTeX</Label>
                            <Textarea id="bibTex" name="bibTex" onChange={handleTextChange} value={bibTex}/>
                        </div>
                        <Button type="submit" className="w-full" disabled={!isButtonEnabled || isLoading}>
                            {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin"/>}
                            Convert
                        </Button>
                    </form>
                </CardContent>
            </Card>
            <Card className="row-span-1">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">MLA Citation</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center space-y-2 bg-white rounded-xl">
                        <Textarea id="mla" value={mla} readOnly disabled/>
                        <Button disabled={mla === ""} onClick={() => {
                            navigator.clipboard.writeText(mla);
                            toast({
                                description: "Citation copied to clipboard!",
                            })
                        }}>Copy to Clipboard</Button>
                    </div>
                </CardContent>
            </Card>
            <Toaster/>
        </div>
    )
}

