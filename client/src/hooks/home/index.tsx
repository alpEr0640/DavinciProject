import { useQuery } from "@tanstack/react-query";
import { FetchUsers } from "../../services/home";

export function useHomepage(){
    
const getUsers= useQuery({
    queryKey:['users'],
    queryFn: FetchUsers,
})


return {getUsers}
}
