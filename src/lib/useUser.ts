"use client";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { useQuery } from "@tanstack/react-query";

export default function useUser() {
  const supabase = supabaseBrowser();

  /**
   * This function gets the logged in supabase user and checks if they exist in the custom "users" database.
   * If they don't exist, then they are added to the database with their name, email, picture, and breaches.
   */
  const getUser = async () => {
    const { data } = await supabase.auth.getSession();

    if (data.session?.user) {
      let { data: user, error: userDoesNotExist } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.session.user.id)
        .single();

      if (user) return user;
      else if (userDoesNotExist) {
        const breaches = await fetch("/api/breaches", {
          method: "POST",
          body: JSON.stringify({ email: data.session.user.email }),
        })
          .then((res) => res.json())
          .then((data) => {
            return data;
          });

        const { data: user, error } = await supabase
          .from("users")
          .insert([
            {
              name: data.session.user.user_metadata.full_name,
              email: data.session.user.email,
              picture: data.session.user.user_metadata.avatar_url,
              breaches: breaches,
            },
          ])
          .select()
          .single();
        if (user) return user;
      }
    } else {
      return null;
    }
  };

  return useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });
}
