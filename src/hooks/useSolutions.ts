import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export const useSolutions=(problemId:string)=>{
    const query=useQuery({
        queryKey:["solutions",problemId],
        queryFn:async()=>{
            const res=await axios.get(`http://localhost:5000/api/solutions?problemId=${problemId}`)
            return res.data
        },
        enabled:!!problemId
    })
    return query
}