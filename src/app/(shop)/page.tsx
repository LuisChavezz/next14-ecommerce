import { Title } from "@/components";
import { titleFont } from "@/config/fonts";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Title 
        title="Shop"
        subtitle="All our products in one place"
        className="mb-2"
      />
    </>
  );
}
