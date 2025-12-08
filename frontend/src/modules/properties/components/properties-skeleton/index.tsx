import { Skeleton } from "@src/components/ui/skeleton";

export default function PropertiesSkeleton() {
	return (
		<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{Array.from({ length: 8 }).map((_, i) => (
				<div key={i} className="flex flex-col space-y-3">
					<Skeleton className="h-[200px] w-full rounded-xl" />
					<div className="space-y-2">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-[80%]" />
					</div>
				</div>
			))}
		</div>
	);
}
