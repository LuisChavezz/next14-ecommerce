import { titleFont } from "@/config/fonts";
import Image from "next/image";

export default function Home() {
  return (
    <main className="p-24">
      <h1>Hola mundo</h1>
      <h1 className={ `${titleFont.className} font-bold` }>Hola mundo</h1>
    </main>
  );
}
