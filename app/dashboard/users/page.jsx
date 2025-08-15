import Search from "@/app/components/dashboard/search/search";
import styles from "../../components/dashboard/users/users.module.css";
import Link from "next/link";
import Image from "next/image";
import Pagination from "@/app/components/dashboard/pagination/pagination";
import { fetchUsers } from "@/app/lib/data";
import { deleteUser } from "@/app/lib/actions";

async function UsersPage(props) {
  const searchParams = await props.searchParams;
  const q = searchParams?.q || "";
  const page = searchParams?.page || 1;
  const { count, users = [] } = await fetchUsers(q, page);

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        {/* use 'placeholder' prop consistently */}
        <Search placeholder="Search for a user" />
        <Link href="/dashboard/users/add">
          <button className={styles.addButton}>Add New</button>
        </Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Name</td>
            <td>Email</td>
            <td>Created At</td>
            <td>Role</td>
            <td>Status</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            // normalize id and createdAt to plain values
            const id = String(user._id ?? user.id ?? "");
            const created = user.createdAt
              ? new Date(user.createdAt).toString().slice(4, 16)
              : "";

            return (
              <tr key={id}>
                <td>
                  <div className={styles.user}>
                    <Image
                      src={user.img || "/noavatar.png"}
                      alt=""
                      width={40}
                      height={40}
                      className={styles.userImage}
                    />
                    {user.username}
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{created}</td>
                <td>{user.isAdmin ? "Admin" : "Client"}</td>
                <td>{user.isActive ? "active" : "passive"}</td>
                <td>
                  <div className={styles.buttons}>
                    <Link href={`/dashboard/users/${id}`}>
                      <button className={`${styles.button} ${styles.view}`}>
                        View
                      </button>
                    </Link>

                    <form action={deleteUser}>
                      {/* pass plain string id */}
                      <input type="hidden" name="id" value={id} />
                      <button className={`${styles.button} ${styles.delete}`}>
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagination count={count} />
    </div>
  );
}

export default UsersPage;
