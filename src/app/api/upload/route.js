import {NextResponse} from "next/server";
import fs from "fs";
import path from "path";
import compress from "../../utils/compress.js";

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json({error: "Nenhum arquivo enviado."}, {status: 400});
        }

        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const uploadDir = path.join(process.cwd(), "public/uploads");

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, {recursive: true});
        }

        const filePath = path.join(uploadDir, file.name);
        fs.writeFileSync(filePath, fileBuffer);

        const compressedPath = await compress(filePath, file.name);

        const fileNameBase = path.basename(compressedPath);

        return NextResponse.json({message: "Upload bem-sucedido!", path: `/uploads/${fileNameBase}`});
    } catch (error) {
        console.error("Erro no upload:", error);
        return NextResponse.json({error: "Erro interno no servidor."}, {status: 500});
    }
}