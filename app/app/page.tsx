import Image from "next/image";
import { redirect } from 'next/navigation';

export default function Home() {
  if(true)redirect("/home");
  return (
    <div>Hi</div>
  );
}
