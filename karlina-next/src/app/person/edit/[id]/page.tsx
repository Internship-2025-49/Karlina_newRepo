"use client";
import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { fetcher } from "@/app/libs";
import useSWR from "swr";

export default function PostEdit({ params }: { params: Promise<{ id: number }> }) {
    const router = useRouter();
    const resolvedParams = use(params);

    const { data: person, isLoading, error } = useSWR(`/utils/queries/person/${resolvedParams.id}`, fetcher);
    const [name, setName] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [phone, setPhone] = useState<string>("");

    useEffect(() => {
        if (person?.result) {
            setName(person.result.name);
            setAddress(person.result.address);
            setPhone(person.result.phone);
        }
    }, [person, isLoading]);

    const updatePerson = async (e: React.FormEvent) => {
        e.preventDefault();
        if (name !== "" && address !== "" && phone !== "") {
            const formData = { name, address, phone };
            const res = await fetch(`/utils/queries/person/${resolvedParams.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const content = await res.json();
            if (content.success > 0) {
                router.push("/persons");
            }
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading person data.</div>;
    if (!person) return <div>Error page.</div>;

    return (
        <div className="w-full max-w-7xl m-auto">
            <form className="w-full" onSubmit={updatePerson}>
                <span className="font-bold text-yellow-500 py-2 block underline text-2xl">Edit Person</span>
                <div className="w-full py-2">
                    <label className="text-sm font-bold py-2 block">Name</label>
                    <input
                        type="text"
                        name="name"
                        className="w-full border-[1px] border-gray-200 p-2 rounded-sm"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="w-full py-2">
                    <label className="text-sm font-bold py-2 block">Address</label>
                    <textarea
                        name="address"
                        className="w-full border-[1px] border-gray-200 p-2 rounded-sm"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>
                <div className="w-full py-2">
                    <label className="text-sm font-bold py-2 block">Phone</label>
                    <input
                        type="text"
                        name="phone"
                        className="w-full border-[1px] border-gray-200 p-2 rounded-sm"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
                <div className="w-full py-2">
                    <button className="w-20 p-2 text-white border-gray-200 border-[1px] rounded-sm bg-green-400">
                        Update
                    </button>
                </div>
            </form>
        </div>
    );
}

