"use client";

import Image from "next/image";
import {Roboto} from "next/font/google";
import {Download, Upload} from "lucide-react"
import {useState, useRef} from "react";

const roboto = Roboto({subsets: ["latin"]});

export default function Home() {
    const [selectFile, setSelectFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        const isPDF = await checkFile(file);
        if (isPDF) {
            setSelectFile(file)
        } else {
            return alert("Por favor selecione um PDF");
        }
    }

    const checkFile = async (file) => {
        const buffer = await file.slice(0, 5).arrayBuffer();
        const header = new TextDecoder().decode(buffer);
        return header.startsWith('%PDF');
    }

    return (
        <main className={`flex flex-row w-screen h-screen justify-center items-center ${roboto.className}`}>
            <div className={`flex flex-col justify-items-center items-center`}>
                <Image
                    src={`/logo-red.svg`}
                    alt={`Logo PDF`}
                    width={100}
                    height={100}
                />
                <h1 className={`text-4xl p-5`}>Compress</h1>
                <ol className={`pb-5`}>
                    <li>1. Upload file.</li>
                    <li>2. Download file.</li>
                </ol>
                <div className={`flex flex-row`}>
                    <input
                        type="file"
                        accept="application/pdf"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className={`hidden`}
                    />
                    <button
                        onClick={() => fileInputRef.current.click()}
                        className={`flex flex-row items-center py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700`}>
                        <Upload className={`mr-1`}/>
                        Upload
                    </button>
                    <button
                        className={`flex flex-row items-center focus:outline-none text-white bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:focus:ring-red-900 opacity-30 cursor-not-allowed`}
                        disabled>
                        <Download className={`mr-1`}/>
                        Download
                    </button>
                </div>
            </div>
        </main>
    );
}
