"use client";

import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@src/components/ui/pagination";

interface ClientsPaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export function ClientsPagination({
	currentPage,
	totalPages,
	onPageChange,
}: ClientsPaginationProps) {
	const getPageNumbers = () => {
		const pages: (number | string)[] = [];
		const maxVisible = 3;

		if (totalPages <= 5) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			pages.push(1);

			if (currentPage > maxVisible + 1) {
				pages.push("...");
			}

			const start = Math.max(2, currentPage - 1);
			const end = Math.min(totalPages - 1, currentPage + 1);

			for (let i = start; i <= end; i++) {
				pages.push(i);
			}

			if (currentPage < totalPages - maxVisible) {
				pages.push("...");
			}

			pages.push(totalPages);
		}

		return pages;
	};

	if (totalPages <= 1) {
		return null;
	}

	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						onClick={() => onPageChange(currentPage - 1)}
						className={
							currentPage === 1
								? "pointer-events-none opacity-50"
								: "cursor-pointer"
						}
					/>
				</PaginationItem>

				{getPageNumbers().map((page, index) => (
					<PaginationItem key={index}>
						{typeof page === "number" ? (
							<PaginationLink
								isActive={page === currentPage}
								onClick={() => onPageChange(page)}
								className={
									page === currentPage
										? "bg-tertiary hover:bg-tertiary-light cursor-pointer text-white border-none"
										: "cursor-pointer"
								}
							>
								{page}
							</PaginationLink>
						) : (
							<PaginationEllipsis />
						)}
					</PaginationItem>
				))}

				<PaginationItem>
					<PaginationNext
						onClick={() => onPageChange(currentPage + 1)}
						className={
							currentPage === totalPages
								? "pointer-events-none opacity-50"
								: "cursor-pointer"
						}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
