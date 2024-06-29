"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

type UserTypes = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
};

export default function User() {
  const [users, setUsers] = useState<UserTypes[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchUsers = useCallback(async () => {
    const response = await fetch(`https://reqres.in/api/users?page=${page}`);
    const data = await response.json();

    return data;
  }, [page]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();

      if (data.data.length > 0) {
        setUsers((prevUsers) => [...prevUsers, ...data.data]);
        setPage(page + 1);
        setHasMore(true); // Ensure hasMore is true when there is more data
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    loadUsers();
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    const checkNextPage = async () => {
      const checkHasMore = await fetchUsers();

      if (checkHasMore.data.length > 0) {
        console.log("has next data");
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    };

    checkNextPage();
  }, [page, fetchUsers]);

  return (
    <div className="text-center">
      <ul className="flex flex-wrap justify-center gap-10 min-h-60">
        {users.map((user) => (
          <li
            className="min-w-[30%] min-h-40 flex items-center justify-center"
            key={user.id}
          >
            <div>
              <Image
                alt={`${user.first_name} ${user.last_name}`}
                src={user.avatar}
                width="40"
                height="40"
                className="m-auto w-10 h-10 rounded-full"
              />
              <div className="text-center leading-8">
                <p>{user.id}</p>
                <p>{user.email}</p>
                <p>
                  {user.first_name} {user.last_name}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {loading && <p>Loading...</p>}

      {!loading && users.length > 0 && (
        <button
          className={`m-auto flex justify-center my-10 capitalize text-white px-10 py-2.5 rounded-sm shadow-md ${
            loading || !hasMore
              ? "bg-primary/50 active:bg-primary/50 hover:bg-primary/50"
              : "bg-primary active:bg-primary hover:bg-primary"
          }`}
          onClick={handleLoadMore}
          disabled={loading || !hasMore}
        >
          Load more
        </button>
      )}
    </div>
  );
}
