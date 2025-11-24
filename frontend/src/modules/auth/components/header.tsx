import { Heading } from "@src/components/ui/heading";
import { Bell } from "lucide-react";
export default function HeaderAuth() {
  return (
      <header className="bg-primary">
				<div className="flex justify-between items-center max-w-[1440px] mx-auto px-4 py-3">
          <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="55" height="68" viewBox="0 0 59 61" fill="none">
            <path d="M28.9982 58.8485H8.49817V54.3485H12.5M28.9982 58.8485H49.4982V54.3485H46M28.9982 58.8485V43.3485M28.9982 43.3485L12.9982 27.3485C12.9982 27.3485 9.93305 26.877 8.49817 28.5244M28.9982 43.3485L44.9982 27.3485C44.9982 27.3485 48.063 26.6415 49.4982 28.3019M20 44.3503L7.99817 32.3485C7.52822 30.4687 7.84352 29.276 8.49817 28.5244M37.9963 44.3503L49.9982 32.3485C50.4689 30.3112 50.1533 29.0598 49.4982 28.3019M46 54.3485V49.8493L57 38.8493V11.8493C57 11.8493 53 5.34934 49.4982 11.8493V28.3019M46 54.3485H12.5M12.5 54.3485V49.8493L1.5 38.8493V11.8493C1.5 11.8493 5 5.85498 8.49817 11.8493V28.5244M23.5 32.3485V19.355H34.5V32.3485M41.5 26.355V16.355M41.5 16.355L29.5 7.35498L15 17.855L12.5 13.855L29.5 1.85498L37.5 7.85498M41.5 16.355L43.5 17.855L45.5 13.855L42 11.23M42 11.23V1.85498H37.5V7.85498M42 11.23L37.5 7.85498M17.5 26.355V16.355" stroke="white" stroke-width="3" stroke-linecap="round"/>
          </svg>
				  <Heading className="text-white ml-1" variant={"h3"} weight={"light"}>REDPROP</Heading>
        </div>
        <Bell className="text-white" />
        </div>
			</header>
  )
}