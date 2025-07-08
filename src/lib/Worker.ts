import { createWorker } from "tesseract.js";

const converter = async (img: string) => {
    const worker = await createWorker('eng');
    await worker.setParameters({
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,:-/@',
        // preserve_interword_spaces: '1',
    });
    const ret = await worker.recognize(img);
    await worker.terminate();
    return ret.data.text;
}

export default converter;