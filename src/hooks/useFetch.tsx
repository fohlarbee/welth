import { useState } from "react";
import { toast } from "sonner";

interface UseFetchResult<T, Args extends unknown[]> {
    data: T | undefined;
    loading: boolean | null;
    error: Error | null;
    fn: (...args: Args) => Promise<void>;
    setData: React.Dispatch<React.SetStateAction<T | undefined>>;
}

type Callback<T, Args extends unknown[]> = (...args: Args) => Promise<T>;

const useFetch = <T, Args extends unknown[] = unknown[]>(cb: Callback<T, Args>): UseFetchResult<T, Args> => {
    const [data, setData] = useState<T | undefined>(undefined);
    const [loading, setLoading] = useState<boolean | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const fn = async (...args: Args): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            const response = await cb(...args);
            setData(response);
            setError(null);
        } catch (error) {
            if(error instanceof Error){
                setError(error);
                toast.error(error.message);
            }
        } finally {
            setLoading(false);
        }
    };
    return { data, loading, error, fn, setData };
};
export default useFetch;