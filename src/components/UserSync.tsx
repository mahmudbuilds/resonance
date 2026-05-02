"use client";

import { useMutation, useConvexAuth } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";

export default function UserSync() {
    const storeUser = useMutation(api.users.storeUser);
    const { isAuthenticated } = useConvexAuth();

    useEffect(() => {
        if (isAuthenticated) {
            try {
                storeUser();
            }

            catch (error) {
                console.error("Failed to sync user:", error)
            }
        }
    }, [storeUser, isAuthenticated]);

    return null;
}