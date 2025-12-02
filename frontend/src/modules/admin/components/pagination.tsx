import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem,
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious
 } from "@src/components/ui/pagination"

export const UserPagination = () => {
  return <Pagination className="my-8">
    <PaginationContent className="text-black">
      <PaginationItem>
        <PaginationPrevious href="#" className="border border-pagination-border hover:bg-tertiary hover:text-white" />
      </PaginationItem>
      <PaginationItem>
        <PaginationLink href="#" isActive className="border border-pagination-border active:bg-secondary hover:bg-tertiary hover:text-white">1</PaginationLink>
      </PaginationItem>
       <PaginationItem>
        <PaginationLink href="#" className="border border-pagination-border hover:bg-tertiary hover:text-white">2</PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationEllipsis className="text-input-border" />
      </PaginationItem>
      <PaginationItem>
        <PaginationNext href="#" className="border border-pagination-border hover:bg-tertiary hover:text-white" />
      </PaginationItem>
    </PaginationContent>
  </Pagination>
}