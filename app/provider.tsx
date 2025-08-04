"use client";
import React from "react";
import Header from "./_components/Header";

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useContext } from "react";

import { UserDetailContext } from "@/context/UserDetailContext";

function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const createUser = useMutation(api.user.createUser);
  const [userDetails, setUserDetails]  = useState<any>();
  const { user } = useUser();

  useEffect(() => {
    user && createNewUser();
  }, [user]);

  const createNewUser = async () => {
    if (user) {
      const result = await createUser({
        name: user?.fullName ?? "",
        imageUrl: user.imageUrl,
        email: user.primaryEmailAddress?.emailAddress ?? "",
      });
      setUserDetails(result);
      console.log("result", result);
    }
  };

  return (
    <div>
      <UserDetailContext.Provider value={{userDetails}}>
        <Header />
        {children}
      </UserDetailContext.Provider>
    </div>
  );
}

export default Provider;

export const useUserDetails = () => {
  const { userDetails } = useContext(UserDetailContext);
  return userDetails;
};
