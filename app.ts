// src/app.ts
import express, { Request, Response } from "express";
import multer from "multer";
import jspdf from "jspdf"
import cors from "cors"
import mammoth from "mammoth"
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json())

const storage = multer.memoryStorage();
const upload = multer({storage: storage});

app.post('/convertDoc', upload.single('document'), async (req: Request, res: Response) => {
    if(!req.file)
       return res.status(400).end("File not found!");

   try {
    const doc = new jspdf();

    doc.setFontSize(12);
    const docs = req.file.buffer;   
    const text = await mammoth.extractRawText({buffer: docs});
    let yPosition = 10;
    const maxWidth = 180;

    const lines = doc.splitTextToSize(text.value, maxWidth);

    lines.forEach((line: any | any[]) => {

        if(yPosition + 10 > doc.internal.pageSize.height){
            doc.addPage();

            yPosition = 10;
        }
        doc.text(line, 10, yPosition);
        yPosition += 10;
    });
    

    const pdfBuffer = doc.output('arraybuffer')

    res.contentType('application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=converted-document.pdf');
    res.end(Buffer.from(pdfBuffer));
   } catch (err){
    console.error("Error:" + err);
    res.status(500).json({message: err});
   }
})

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Expresds!');
});

app.listen(port, () => {
  console.log(`Server is running on ports ${port}`);
});
