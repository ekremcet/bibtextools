import {Inter} from "next/font/google";

const inter = Inter({subsets: ["latin"]});


const ToolData = [
    {
        title: "BibTeX to CFF",
        description: "Convert BibTeX format to CFF format for GitHub citations",
        url: "/bibtex-to-cff"
    },
    {
        title: "BibTeX to MLA",
        description: "Convert BibTeX format to MLA format for text citations",
        url: "/bibtex-to-mla"
    },
];

interface ToolCardProps {
    title: string;
    description: string;
    url: string;
}

function ToolCard({title, description, url}: ToolCardProps) {
    return (
        <a
            key={title}
            className="group p-5 bg-white hover:bg-gray-100 rounded-xl gap-y-2 w-full border border-slate-500/50 flex flex-col items-start justify-between"
            href={url}
        >
            <div className="flex flex-col gap-y-1">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-slate-700/70 text-sm">{description}</p>
            </div>
        </a>
    )
}

export default function Home() {
    return (
        <main
            className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className} bg-gradient-to-r from-sky-400/20 to-blue-500/20`}
        >
            <section className="hero__section">
                <div
                    className="hero__container px-7 lg:px-10 max-w-6xl mx-auto flex flex-col gap-y-10 lg:flex-row items-center gap-x-10 justify-center py-10 lg:py-24">
                    <div className="hero-content lg:w-[650px] lg:px-5 flex flex-col gap-y-5">
                        <h1 className="text-4xl md:text-5xl xl:text-[50px] leading-[1.2] md:max-w-xl md:mx-auto text-center lg:text-left lg:mx-0 lg:max-w-full font-semibold text-black">
                            Tools that make working with BibTeX easy
                        </h1>
                        <p className="text-sm md:text-base font-medium text-[#141414] md:leading-[1.5] md:max-w-lg md:mx-auto lg:mx-0 lg:max-w-full md:text-center lg:text-left">
                            Trying to remove annoying BibTeX processing from your workflow
                        </p>
                        <div
                            className="flex flex-col items-center md:items-start justify-center lg:justify-start gap-x-5 gap-y-3">
                            {ToolData.map(({title, description, url}) => (
                                <ToolCard title={title} description={description} url={url}/>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
