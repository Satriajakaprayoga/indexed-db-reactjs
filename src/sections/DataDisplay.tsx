import React, { useEffect, useState } from "react";
import {
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
} from "@mui/material";
import { IData, openDB } from "../indexedDB";

export default function DataDisplay() {
  const [data, setData] = useState<IData[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const db = await openDB();
        const transaction = db.transaction("myObjectStore", "readonly");
        const objectStore = transaction.objectStore("myObjectStore");
        const request = objectStore.getAll();

        request.onsuccess = (event) => {
          setData((event.target as IDBRequest).result!);
        };

        request.onerror = (event) => {
          console.error(
            "Error fetching data:",
            (event.target as IDBRequest).error
          );
        };
      } catch (error) {
        console.error("Error opening IndexedDB:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <Box mt={3} width="100%">
      <Container>
        <Typography variant="h4" gutterBottom>
          Data from IndexedDB
        </Typography>
        <List>
          {data.map((item) => (
            <ListItem key={item.id}>
              <ListItemText
                primary={`ID: ${item.id}`}
                secondary={`First Name: ${item.firstName}, Last Name: ${item.lastName}`}
              />
            </ListItem>
          ))}
        </List>
      </Container>
    </Box>
  );
}
