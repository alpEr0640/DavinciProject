import { axiosAuth } from "../../lib/axios"
import { usersSchema } from "./type";



export const FetchUsers = async ()=>{
    const res = await axiosAuth.get("/users");
    console.log(res)
    const parsed = usersSchema.parse(res.data)
    return parsed
}