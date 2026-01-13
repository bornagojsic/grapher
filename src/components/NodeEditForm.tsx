import { Label } from "./ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";

interface NodeEditFormProps {
  defaultValues: { name: string; color: string };
  alreadyUsedNames: string[];
  onSave: (updates: { label: string; color: string }) => void;
  onDelete: () => void;
}

export default function NodeEditForm({
  defaultValues,
  alreadyUsedNames,
  onSave,
  onDelete,
}: NodeEditFormProps) {
  const formSchema = z.object({
    name: z
      .string()
      .min(1, { message: "Name is required." })
      .max(25, { message: "Name must be at most 25 characters long." })
      .refine(
        (value) =>
          value === defaultValues.name || !alreadyUsedNames.includes(value),
        {
          message: "This name is already in use.",
        },
      ),
    color: z
      .string()
      .regex(
        /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/,
        "Invalid hex color",
      ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    onSave({
      label: values.name,
      color: values.color,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="items-center space-x-2 justify-center">
              <Label>Name:</Label>
              <FormControl>
                <Input
                  placeholder="v"
                  {...field}
                  className="max-w-[250px] min-w-[250px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-2 flex-wrap justify-center">
              <FormLabel>Color:</FormLabel>
              <FormControl>
                <Input
                  placeholder="#000000"
                  type="color"
                  {...field}
                  className="max-w-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row items-center space-x-2 flex-wrap justify-between">
          <Button
            variant="destructive"
            className="mt-2"
            type="button"
            onClick={() => onDelete()}
          >
            Delete
          </Button>
          <Button variant="outline" type="submit" className="mt-2">
            Save changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
