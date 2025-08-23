import { useParams } from "react-router";
import Navbar from "../components/Navbar";

export default function BookPage() {
  const { id } = useParams();

  return (
    <div className="w-full h-full flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <h1>{id}</h1>
      </div>
    </div>)

}
