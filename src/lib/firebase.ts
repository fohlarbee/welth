// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId:process.env.APP_ID
  };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);


export async function uploadFile(file:File, setProgress?: (progress:number) => void){
    return new Promise ((resolve, reject) => {
         try {
            const strageRef = ref(storage, file.name);
            const uploadTask = uploadBytesResumable(strageRef, file);

            uploadTask.on('state_changed', (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                if (setProgress) setProgress(progress);
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                    default:
                        break;
                }
            }, error => {
                reject(error);
            }, () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {

                    resolve(downloadURL as string);
                });
            }
        )
         } catch (error) {
            console.log('error',error);
            reject(error);
         }
    })
}