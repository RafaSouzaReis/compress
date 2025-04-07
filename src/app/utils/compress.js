import {exec} from "child_process";
import path from "path";
import fs from "fs";
import {promisify} from "util";

const execPromise = promisify(exec);

export default async function compressPDF(inputPath, fileName) {
    if (!fs.existsSync(inputPath)) {
        throw new Error("Arquivo inexistente");
    }

    const outputFileName = `compress-${fileName}`;
    const outputPath = path.join(process.cwd(), "public", "uploads", outputFileName);
    
    const command = `gswin64c -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen \
-dNOPAUSE -dQUIET -dBATCH -sOutputFile="${outputPath}" "${inputPath}"`;

    await execPromise(command);

    return outputPath;
}
