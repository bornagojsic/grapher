import createBananaTree from "@/utils/banana-tree";
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
import type { GraphListItem } from "./GraphSelectionForm";
import { Button } from "./ui/button";

export const formSchema = z.object({
    name: z
        .string()
        .min(1, {
            message: "Name is required.",
        })
        .max(25, {
            message: "Name must be at most 25 characters long.",
        }),
    n: z.coerce
        .number()
        .nonnegative()
        .int()
        .min(1, {
            message: "N must be at least 1.",
        })
        .max(50, {
            message: "N must be at most 50.",
        }),
    k: z.coerce
        .number()
        .nonnegative()
        .int()
        .min(1, {
            message: "K must be at least 1.",
        })
        .max(50, {
            message: "K must be at most 50.",
        }),
});

interface BananaTreeCreationFormProps {
    defaultValues?: z.infer<typeof formSchema>;
    addGraph?: (graph: GraphListItem) => void;
}

export default function BananaTreeCreationForm({
    defaultValues,
    addGraph,
}: BananaTreeCreationFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues || {
            name: "B(2, 1)",
            n: 2,
            k: 1,
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        addGraph?.({
            id: crypto.randomUUID(),
            name: values.name,
            description: `Banana tree with n = ${values.n} and k = ${values.k}.`,
            active: false,
            ...createBananaTree(values.n, values.k),
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
                                    placeholder="B(n, k)"
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
                    name="n"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 flex-wrap justify-center">
                            <FormLabel>n:</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="1"
                                    type="number"
                                    {...field}
                                    className="max-w-[100px]"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="k"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 flex-wrap justify-center">
                            <FormLabel>k:</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="1"
                                    type="number"
                                    {...field}
                                    className="max-w-[100px]"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button variant="outline" type="submit">
                    Add graph
                </Button>
            </form>
        </Form>
    );
}
