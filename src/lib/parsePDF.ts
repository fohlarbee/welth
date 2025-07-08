import path from "path";
import {PDFLoader} from '@langchain/community/document_loaders/fs/pdf'
import fs from "fs/promises";

export const parsePDF = async(userId:string, url:string) => {
     const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to download PDF");
        const folderPath = path.resolve(process.cwd(), "pdf_uploads");
        await fs.mkdir(folderPath, { recursive: true });
    
        const fileName = `loan_${userId}_${Date.now()}.pdf`;
        const filePath = path.join(folderPath, fileName);
    
        const arrayBuffer = await response.arrayBuffer();
        await fs.writeFile(filePath, Buffer.from(arrayBuffer));
    
        const loader = new PDFLoader(filePath);
        const pages = await loader.load();
        const text =  pages.map((page) => page.pageContent).join('\n');

        return text;
}