 
 "use client";
   import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {  SparkleIcon, Upload } from 'lucide-react';
import React from 'react'
 import {useDropzone} from 'react-dropzone';
import {CircularProgressbar, buildStyles} from 'react-circular-progressbar' 
import useFetch from '@/hooks/useFetch';
import { loanRecommendation } from '../../../../../../../actions/loan';
import { uploadFile } from '@/lib/firebase';
import { toast } from 'sonner';
 const LoanCard = ({accountId}:{accountId:string}) => {
    const [progress, setProgress] = React.useState(0);
    const [isUploading, setIsUploading] = React.useState(false);

    const {
    loading: loanRecommendationLoading,
    fn: loanRecommendationFn,
    data: loanRecommendationData,
    error,
  } = useFetch(loanRecommendation);

    const {getRootProps, getInputProps} = useDropzone({
        accept:{
            'application/pdf*': [ '.pdf']
        },
        maxFiles:1,
        maxSize:15_000_000, 
        onDrop:async (acceptedFiles) => {
            try {
                
                setIsUploading(true);
                const file = acceptedFiles[0];
                if (!file) return; 
                if (file.size > 10 * 1024 * 1024){
                    alert('Kindly upload a smaller file');
                    return
                }
                 const downloadURL = await uploadFile(file as File, setProgress) as string;
                 setIsUploading(false);
                 toast.success('Hang on, Welth AI is working...')
                 await loanRecommendationFn(downloadURL, accountId)
            } catch (err) {
                toast.error('Could not analyze your bank statement');
                console.error('Could not analyze your bank statement', error,err)
                return;
            }finally{
                setIsUploading(false);
                return;

            }
        }
    })
  
   return (
    <Card className='col-span-2 flex flex-col items-center justify-center p-10 border border-sidebar-border' {...getRootProps()}>
        {!isUploading  && (
            <>
                <SparkleIcon className='h-12 w-12 animate-spin'/>
                <h3 className='mt-2 text-sm font-semibold text-gray-900'>
                    Create a new Recommendation
                </h3>
                <p className='mt-1 text-center text-sm text-gray-500'>
                    Analyze your Bank statements with Welth AI.
                    <br/>
                    Powered by AI.
                </p>
                <div className="mt-8">
                    <Button disabled={isUploading} variant='outline'>
                        <Upload className='-ml-0.5 mr-1.5 h-5 w-5' aria-hidden={'true'}/>
                            Upload Bank Statement

                            <input className='hidden' {...getInputProps()}/>

                    </Button>
                </div>
            </>
        )}
        {
            isUploading && (
                <div className="items-center justify-center">
                    <CircularProgressbar
                        value={progress}
                        text={`${progress}%`}
                        styles={buildStyles({
                            textColor: '#1DB954',
                            pathColor: '#1DB954',
                            trailColor: 'rgba(0,0,0,0.1)'
                        })}
                        className='size-20 text-center justify-center'
                    />
                    <p className='text-sm text-center text-gray-300'>Uploading your File</p>

                </div>
            )
        }
    </Card>
   )
 }
 
 export default LoanCard;