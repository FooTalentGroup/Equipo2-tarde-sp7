"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@src/components/ui/table";
import ColumnFilterDropdown, { FilterOption } from "./filter/page";
import CreateClient from "../clients/create/page";
import AlertDialogDeleteClient from "./delete/page";
import EditClientModal from "./edit/page";

type Client = {
  id: number;
  name: string;
  email: string;
  number: string;
};

export default function DataTableClient() {
  let nextId = 0;
  const [client, setClient] = useState({
    name: "",
    email: "",
    number: "",
  });
  const [clients, setClients] = useState<Client[]>([]);
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    email: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClient({
      ...client,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setClients([
      ...clients,
      {
        id: ++nextId,
        name: client.name,
        email: client.email,
        number: client.number,
      },
    ]);
    setClient({ name: "", email: "", number: "" });
  };

  const handleDeleteClient = (currentClient: Client) => {
    setClients(clients.filter((c) => c.id !== currentClient.id));
  };

  const handleSaveEdit = (updatedClient: Client) => {
    setClients(
      clients.map((c) => (c.id === updatedClient.id ? updatedClient : c))
    );
  };

  const toggleColumn = (column: FilterOption) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  return (
    <>
		<div className="flex justify-between max-w-4xl mx-auto mt-2">
        <CreateClient
          client={client}
          handleChange={handleChange}
          handleAddClick={handleAddClick}
        />
      
        <ColumnFilterDropdown 
          visibleColumns={visibleColumns} 
          onToggleColumn={toggleColumn} 
        />
			</div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-md border max-w-4xl mx-auto mt-2">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.name && <TableHead>Nombre</TableHead>}
              {visibleColumns.email && <TableHead>Email</TableHead>}
              <TableHead>Número</TableHead>
              <TableHead>Editar</TableHead>
              <TableHead>Eliminar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((c) => {
              return (
                <TableRow key={++nextId}>
                  {visibleColumns.name && <TableCell>{c.name}</TableCell>}
                  {visibleColumns.email && <TableCell>{c.email}</TableCell>}
                  <TableCell>{c.number}</TableCell>
                  <TableCell>
                    <EditClientModal client={c} onSave={handleSaveEdit} />
                  </TableCell>
                  <TableCell>
                    <AlertDialogDeleteClient
                      handleClick={() => handleDeleteClient(c)}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}