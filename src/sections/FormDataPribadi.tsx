import { useForm, Resolver } from "react-hook-form";
import FormProvider from "../hook-form/FormProvider";
import { Button, Grid } from "@mui/material";
import { useEffect, useMemo } from "react";
import { RHFTextField } from "../hook-form";
import { addData, deleteData, getData, openDB, updateData } from "../indexedDB";
import DataDisplay from "./DataDisplay";

type FormValues = {
  firstName: string;
  lastName: string;
};

const resolver: Resolver<FormValues> = async (values) => {
  return {
    values: values.firstName ? values : {},
    errors: !values.firstName
      ? {
          firstName: {
            type: "required",
            message: "This is required.",
          },
        }
      : {},
  };
};

export default function FormDataPribadi() {
  const defaultValues = useMemo(
    () => ({
      firstName: "",
      lastName: "",
    }),
    []
  );
  const methods = useForm<FormValues>({ resolver, defaultValues });
  const { handleSubmit, reset } = methods;

  useEffect(() => {
    async function fetchData() {
      const db = await openDB();
      const data = await getData(db, 1); // Fetch data with id 1
      if (data) {
        reset(data);
      }
    }

    fetchData();
  }, [reset]);

  const onSubmit = async (data: FormValues) => {
    const db = await openDB();
    await addData(db, data);
    console.log("Data added to IndexedDB:", data);
  };

  const handleUpdate = async (data: FormValues) => {
    const db = await openDB();
    await updateData(db, { ...data, id: 1 }); // Assuming id 1 for update
    console.log("Data updated in IndexedDB:", data);
  };

  const handleDelete = async () => {
    const db = await openDB();
    await deleteData(db, 1); // Assuming id 1 for delete
    console.log("Data deleted from IndexedDB");
    reset({ firstName: "", lastName: "" });
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container mt={3} spacing={2}>
          <Grid item xs={12}>
            <RHFTextField name="firstName" size="small" label="First Name" />
          </Grid>
          <Grid item xs={12}>
            <RHFTextField name="lastName" label="Last Name" size="small" />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Add
            </Button>
            <Button
              onClick={handleSubmit(handleUpdate)}
              variant="contained"
              color="secondary"
              style={{ marginLeft: "10px" }}
            >
              Update
            </Button>
            <Button
              onClick={handleDelete}
              variant="contained"
              color="error"
              style={{ marginLeft: "10px" }}
            >
              Delete
            </Button>
          </Grid>
        </Grid>
      </FormProvider>
      <DataDisplay />
    </>
  );
}
