import { updateUser } from "@/app/lib/actions";
import { fetchUser } from "@/app/lib/data";
import styles from "../../../components/dashboard/users/singleUser/singleUser.module.css";
import Image from "next/image";

const SingleUserPage = async ({ params }) => {
  const { id } = params;
  const user = await fetchUser(id);

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.imgContainer}>
          {/* .imgContainer must have `position: relative` in CSS for Next Image fill */}
          <Image src={user.img || "/noavatar.png"} alt="" fill />
        </div>
        <div className={styles.username}>{user.username}</div>
      </div>

      <div className={styles.formContainer}>
        <form action={updateUser} className={styles.form}>
          {/* use Mongo _id */}
          <input type="hidden" name="id" value={user._id} />

          <label>Username</label>
          <input type="text" name="username" defaultValue={user.username} placeholder="Username" />

          <label>Email</label>
          <input type="email" name="email" defaultValue={user.email} placeholder="Email" />

          <label>Password</label>
          <input type="password" name="password" placeholder="Leave blank to keep" />

          <label>Phone</label>
          <input type="text" name="phone" defaultValue={user.phone || ""} placeholder="Phone" />

          <label>Address</label>
          <textarea name="address" defaultValue={user.address || ""} placeholder="Address" />

          <label>Is Admin?</label>
          {/* defaultValue must be a string since HTML form values are strings */}
          <select name="isAdmin" id="isAdmin" defaultValue={user.isAdmin ? "true" : "false"}>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>

          <label>Is Active?</label>
          <select name="isActive" id="isActive" defaultValue={user.isActive ? "true" : "false"}>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>

          <button type="submit">Update</button>
        </form>
      </div>
    </div>
  );
};

export default SingleUserPage;
