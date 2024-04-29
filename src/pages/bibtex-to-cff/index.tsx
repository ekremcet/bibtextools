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
import {LoaderCircle, ShieldAlert} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {LogoHeader} from "@/components/LogoHeader";

export default function BibtexToCff() {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [bibFile, setBibFile] = useState<File | null>(null)
    const [bibTex, setBibTex] = useState<string>("")
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
            formData.append('bibTex', bibTex)
            apiPath = '/api/bibtex-to-cff'
        } else if (bibFile !== null) {
            formData.append('bibtexFile', bibFile as Blob)
            apiPath = '/api/bibfile-to-cff'
        } else {
            alert('Please provide a BibTex file or paste BibTex')
        }

        const response = await fetch(apiPath, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'CITATION.cff';
            document.body.appendChild(a); // append the element to the DOM to make it work in Firefox
            a.click();
            a.remove();
        } else {
            alert('Failed to convert BibTeX to CFF');
        }
        setIsLoading(false);
    };

    return (
        <div>
            <LogoHeader/>
            <div className="main-content grid grid-rows-4 justify-center items-center min-h-screen">
                <Card className="w-[700px] row-span-2">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">BibTeX to CFF Converter</CardTitle>
                        <CardDescription>
                            Convert BibTex format to CFF format for GitHub citations
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="bibFile">Bib File</Label>
                                <Input id="bibFile" type="file" name="bibFile" onChange={handleFileChange}
                                       key={inputKey}/>
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
                <Card className="row-span-2">
                    <Alert>
                        <ShieldAlert className="h-4 w-4"/>
                        <AlertTitle>Heads up!</AlertTitle>
                        <AlertDescription>
                            <div className="text-left text-muted-foreground text-xs">
                                <span className="font-bold">There are some parts missing in the conversion, so please fix them manually for now</span>
                                <ol>
                                    <li>date-released: month and day values are taken randomly</li>
                                    <li>url: please replace with the your GitHub URL</li>
                                    <li>version: it's set to 1.0.0 automatically</li>
                                    <li>authors: might return weird combinations if the bibtex file is constructed with
                                        quotes
                                        instead of curly bracelets
                                    </li>
                                </ol>
                            </div>
                        </AlertDescription>
                    </Alert>
                </Card>
            </div>
        </div>
    )
}

