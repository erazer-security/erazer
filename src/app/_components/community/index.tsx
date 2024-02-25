"use client";
import Image from "next/image";
import Link from "next/link";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  email: z.string().email(),
});

export default function Community() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const addToWaitlist = async (values: z.infer<typeof formSchema>) => {
    await fetch("/api/add-to-waitlist", {
      method: "POST",
      body: JSON.stringify(values),
    }).then((res) => {
      if (res.ok) {
        toast({
          variant: "success",
          description: "You have been added to the waitlist.",
        });
        form.reset();
        return;
      }
    });
  };

  return (
    <div className="lg:h-[530px] bg-[#ffffff0d] flex flex-col lg:flex-row lg:justify-around lg:items-center -mx-5 md:-mx-16 lg:-mx-44 mt-48 py-14 lg:py-0">
      <div className="bg-[#0a0a0a] rounded-t-3xl lg:-translate-y-24">
        <div className="overflow-hidden top-0 left-0 right-0 bottom-0 rounded-t-3xl bg-gradient-to-br from-[#7e30e140] to-[#49108b40]">
          <Link
            href="https://www.facebook.com/groups/321264396948984/"
            target="_blank"
          >
            <Image
              src="/community/facebook.svg"
              alt="Facebook"
              width={353}
              height={286}
              className="opacity-20"
            />
          </Link>
        </div>
        <div className="flex flex-col items-start gap-5 p-8">
          <Link
            href="https://www.facebook.com/groups/321264396948984/"
            target="_blank"
            className="bg-[#171717] rounded-xl px-10 py-1"
          >
            <Image
              src="/community/facebookButton.svg"
              alt="Facebook Button"
              width={92}
              height={49}
            />
          </Link>
          <h3 className="text-[32px] font-medium leading-[41.6px]">
            Join our Facebook <br /> community!
          </h3>
        </div>
      </div>
      <div className="flex flex-col gap-5 mt-10 px-5">
        <h3 className="text-[32px] font-medium leading-[41.6px]">
          Sign up to our waitlist.
        </h3>
        <p className="lg:w-[525px] text-[#a7a7a7] text-[22px] font-normal leading-[28.6px] tracking-[0.44px]">
          Subscribe for alerts on our upcoming Dark Web Removal and Image
          Takedown features.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(addToWaitlist)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <div className="flex flex-row justify-between items-center gap-5 p-3 rounded-[40px] border-[1px] border-solid border-[#31343D] backdrop-blur-xl">
                        <input
                          {...field}
                          autoComplete="off"
                          type="email"
                          placeholder="Your Email Address"
                          className="text-white placeholder:text-white text-base font-normal bg-transparent outline-none"
                        />
                        <button
                          type="submit"
                          className="ml-auto flex justify-center items-center px-[18px] py-[10px] rounded-full bg-gradient-to-br from-[#7e30e1] to-[#49108b]"
                        >
                          Submit
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            ></FormField>
          </form>
        </Form>
      </div>
    </div>
  );
}
