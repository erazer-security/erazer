"use client";
import React from "react";
import Image from "next/image";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email(),
  message: z.string().min(1, "Message is required"),
});

export default function ContactUs() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const sendMessage = async (values: z.infer<typeof formSchema>) => {
    await fetch("/api/send-message", {
      method: "POST",
      body: JSON.stringify(values),
    })
      .then((res) => {
        if (res.ok) {
          toast({
            variant: "success",
            description: "Your message has been sent!",
          });
          form.reset();
          return;
        }
      })
      .catch((error) => {
        console.error(error);
        toast({
          variant: "destructive",
          description:
            "Sorry, there was an error sending your message! Please try again.",
        });
        return;
      });
  };

  return (
    <div className="flex flex-col py-10 lg:px-44">
      <div className="flex flex-col gap-5">
        <h2 className="text-[50px] font-medium leading-[55px] tracking-[-2.5px]">
          Contact Erazer
        </h2>
        <p className="text-[#A7A7A7] text-[26px] font-medium leading-[33.8px] tracking-[0.52px]">
          Whether you’re a current or potential user, sponsor or investor, we’d
          love to get in touch.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row justify-between gap-20 mt-10">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(sendMessage)}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col md:flex-row gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-col mr-auto w-full">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <input
                          {...field}
                          autoComplete="off"
                          type="text"
                          placeholder="John Carter"
                          className="text-white placeholder:text-[#8D8BA7] text-base font-normal outline-none bg-[#00000040] border-2 border-[#31343D] backdrop-blur-xl rounded-full px-6 py-4"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              ></FormField>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-col ml-auto w-full">
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <input
                          {...field}
                          autoComplete="off"
                          type="email"
                          placeholder="john@gmail.com"
                          className="text-white placeholder:text-[#8D8BA7] text-base font-normal outline-none bg-[#00000040] border-2 border-[#31343D] backdrop-blur-xl rounded-full px-6 py-4"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              ></FormField>
            </div>

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => {
                return (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <textarea
                        {...field}
                        placeholder="Please type your message here..."
                        className="text-white placeholder:text-[#8D8BA7] text-base font-normal outline-none bg-[#00000040] border-2 border-[#31343D] backdrop-blur-xl rounded-3xl px-6 py-4"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            ></FormField>

            <button
              type="submit"
              className="text-base px-8 py-4 justify-center items-center gap-6 rounded-full backdrop-blur-xl bg-gradient-to-br w-fit from-[#7E30E1] to-[#49108B] hover:from-[#3F0687] hover:to-[#36096A] active:from-[#100320] active:to-[#310267] transition-colors duration-100 ease-in-out"
            >
              Send Message
            </button>
          </form>
        </Form>
        <Image
          src="/contactUs/message.svg"
          alt="contact us"
          width={270}
          height={400}
          className="mx-auto lg:mx-0"
        />
      </div>
    </div>
  );
}
