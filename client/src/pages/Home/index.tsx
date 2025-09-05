import { useHomepage } from "../../hooks/home";

export default function Homepage() {
  const { getUsers } = useHomepage();
  return (
    <div>
      

    {getUsers.data?.map((user, index)=>(
      <div key={index}> {user.name}</div>
    ))}

    </div>
  );
}
