"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, Avatar } from "@mui/material";

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

    // console.log(checkHasMore.data);
  }, [page, fetchUsers]);

  return (
    <div className="text-center">
      <ul className="flex flex-wrap justify-center gap-10">
        {users.map((user) => (
          <li
            className="min-w-[30%] min-h-40 flex items-center justify-center"
            key={user.id}
          >
            <div>
              <Avatar
                alt={`${user.first_name} ${user.last_name}`}
                src={user.avatar}
                className="m-auto"
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
      <Button
        className="m-auto flex justify-center my-10 capitalize text-white bg-primary active:bg-primary hover:bg-primary"
        variant="contained"
        onClick={handleLoadMore}
        disabled={loading || !hasMore} // Disable button if loading or no more content
      >
        Load more
      </Button>
    </div>
  );
}
