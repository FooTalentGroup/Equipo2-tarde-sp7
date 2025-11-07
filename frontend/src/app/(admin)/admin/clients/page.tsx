import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@src/components/ui/table"
import { useState } from "react"

type Client = {
	id: number
		name: string;
		email: string;
		number: string
}

export const DataTableClient = () => {
  let nextId = 0
    const [client, setClient] = useState({
      name: "",
      email: "",
      number: ""
    })
    const [clients, setClients] = useState<Client[]>([])
	
  return <>

  {/* Agregar justo aca el dialog o boton para agregar nuevos clientes a la lista */}

  <div className="overflow-hidden rounded-md border max-w-4xl mx-auto mt-2">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Número</TableHead>
          <TableHead>Editar</TableHead>
          <TableHead>Eliminar</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map(c => {
          return <TableRow key={++nextId}>
            <TableCell>{c.name}</TableCell>
            <TableCell>{c.email}</TableCell>
            <TableCell>{c.number}</TableCell>
            <TableCell>{/* Boton para editar */}</TableCell>
            <TableCell>{/* Boton para eliminar */}</TableCell>
          </TableRow>
        })}
      </TableBody>
    </Table>
  </div>
  </>
}