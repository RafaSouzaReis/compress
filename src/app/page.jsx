"use client";

import Image from "next/image";
import {Roboto} from "next/font/google";
import {Download, Upload, Sun, Moon} from "lucide-react";
import {useState, useRef, useEffect} from "react";
import axios from "axios";

const roboto = Roboto({subsets: ["latin"]});

export default function Home() {
    const [selectFile, setSelectFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [fileUrl, setFileUrl] = useState("");
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef(null);
    const [darkMode, setDarkMode] = useState(false);
    const [sizeKB, setSizeKB] = useState(0);
    const [compressionRate, setCompressionRate] = useState(0);
    const [finalSizeKB, setFinalSizeKB] = useState(0);

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (await checkFile(file)) {
            setSelectFile(file);
            setSizeKB((file.size / 1024).toFixed(2));
        } else {
            alert("Por favor selecione um arquivo PDF válido.");
        }
    };

    useEffect(() => {
        if (selectFile) {
            handleUpload();
        }
    }, [selectFile]);

    useEffect(() => {
        const stored = localStorage.getItem("theme");
        const isDark = stored === "dark";
        setDarkMode(isDark);
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", darkMode);
        localStorage.setItem("theme", darkMode ? "dark" : "light");

        // Atualiza favicon dinamicamente
        const faviconHref = darkMode ? "/logo-red.svg" : "/logo-blue.svg";
        let favicon = document.querySelector("link[rel~='icon']");

        if (!favicon) {
            favicon = document.createElement("link");
            favicon.rel = "icon";
            document.head.appendChild(favicon);
        }

        favicon.href = faviconHref;
    }, [darkMode]);

    const handleUpload = async () => {
        if (!selectFile) return;

        setUploading(true);
        setProgress(0);

        const formData = new FormData();
        formData.append("file", selectFile);

        try {
            const response = await axios.post("/api/upload", formData, {
                headers: {"Content-Type": "multipart/form-data"},
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percent);
                },
            });

            const finalKB = parseFloat(response.data.finalSizeKB);
            const originalKB = parseFloat(sizeKB);
            setFinalSizeKB(finalKB);
            const rate = (((originalKB - finalKB) / originalKB) * 100).toFixed(2);
            setCompressionRate(rate);
            setFileUrl(response.data.path);
        } catch (error) {
            console.error("Erro no upload:", error);
            alert("Erro ao enviar o arquivo");
        } finally {
            setUploading(false);
        }
    };

    if (uploading) {
        return (
            <main className="flex items-center justify-center h-screen w-screen bg-gray-100 dark:bg-black">
                <div className="text-center">
                    <p className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Enviando arquivo...</p>
                    <div className="w-64 h-4 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-300 ${
                                darkMode ? "bg-red-600" : "bg-blue-600"
                            }`}
                            style={{width: `${progress}%`}}
                        ></div>
                    </div>
                    <p className="mt-2 text-gray-700 dark:text-gray-300">{progress}%</p>
                </div>
            </main>
        );
    }

    return (
        <main className={`flex flex-row w-screen h-screen justify-center items-center ${roboto.className}`}>
            <button
                onClick={() => setDarkMode(!darkMode)}
                className="absolute top-5 right-5 p-2 rounded-full bg-gray-200 dark:bg-gray-800"
                aria-label="Alternar tema"
            >
                {darkMode ? <Sun/> : <Moon/>}
            </button>

            <div className="flex flex-col justify-items-center items-center">
                <Image
                    src={darkMode ? `/logo-red.svg` : `/logo-blue.svg`}
                    alt="Logo PDF"
                    width={100}
                    height={100}
                />
                <h1 className="text-4xl p-5">Compress</h1>
                <ol className="pb-5 text-center">
                    <li>1. Upload file.</li>
                    <li>2. Download file.</li>
                </ol>

                <div className="flex flex-row">
                    <input
                        type="file"
                        accept="application/pdf"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-row items-center py-2.5 px-5 me-2 mb-2 text-sm font-medium rounded-lg border focus:outline-none transition-colors duration-300 bg-black text-white border-gray-200 hover:bg-white hover:text-blue-600 focus:ring-4 focus:ring-gray-100 dark:bg-white dark:text-black dark:border-gray-600 dark:hover:bg-black dark:hover:text-red-600 dark:focus:ring-gray-700"
                        aria-label="Fazer upload de arquivo PDF"
                    >
                        <Upload className="mr-1"/>
                        Upload
                    </button>

                    <a
                        href={fileUrl || "#"}
                        download
                        className={`flex flex-row items-center text-white bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:focus:ring-red-900 ${
                            fileUrl
                                ? "opacity-100 cursor-pointer hover:bg-red-800"
                                : "opacity-30 cursor-not-allowed pointer-events-none"
                        }`}
                        aria-label="Baixar arquivo comprimido"
                    >
                        <Download className="mr-1"/>
                        Download
                    </a>
                </div>

                {fileUrl && (
                    <div className="mt-4 text-center text-sm text-gray-800 dark:text-gray-200">
                        <p>Tamanho original: {sizeKB} KB</p>
                        <p>Tamanho final: {finalSizeKB} KB</p>
                        <p className="mt-2 text-gray-700 dark:text-gray-300">
                            Taxa de compressão: {compressionRate}%
                        </p>

                        <div className="w-64 h-4 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-300 ${
                                    darkMode ? "bg-red-600" : "bg-blue-600"
                                }`}
                                style={{width: `${compressionRate}%`}}
                            ></div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

const checkFile = async (file) => {
    const buffer = await file.slice(0, 5).arrayBuffer();
    return new TextDecoder().decode(buffer).startsWith("%PDF");
};
