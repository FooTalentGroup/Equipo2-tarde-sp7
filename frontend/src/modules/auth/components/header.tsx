import AuthNav from "@public/images/redprop.png"
import { Heading } from "@src/components/ui/heading";
import Image from "next/image";
import { Bell } from "lucide-react";
export default function HeaderAuth() {
  return (
      <header className="bg-primary">
				<div className="flex justify-between items-center max-w-[1440px] mx-auto px-4 py-3">
          <div className="flex items-center">
          <Image src={AuthNav} alt="marca de redprop" width={55} height={56} />
				  <Heading className="text-white ml-1" variant={"h3"} weight={"light"}>REDPROP</Heading>
        </div>
        <Bell className="text-white" />
        </div>
			</header>
  )
}