"use client";

import { useMutation, useConvexAuth } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";

export default function UserSync() {
    const storeUser = useMutation(api.users.storeUser);
    const { isAuthenticated } = useConvexAuth();

    useEffect(() => {
        if (isAuthenticated) {
            storeUser();
        }
    }, [storeUser, isAuthenticated]);

    return null;
}