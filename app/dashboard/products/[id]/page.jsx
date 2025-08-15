import { updateProduct } from "@/app/lib/actions";
import { fetchProduct } from "@/app/lib/data";
import styles from "../../../components/dashboard/products/singleProduct/singleProduct.module.css";
import Image from "next/image";

const SingleProductPage = async (props) => {
  const params = await props.params;
  const { id } = params;
  const product = await fetchProduct(id);

  // Normalize primitives locally (defensive)
  const pid = String(product._id ?? product.id ?? "");
  const title = product.title ?? "";
  const price = product.price ?? "";
  const stock = product.stock ?? "";
  const color = product.color ?? "";
  const size = product.size ?? "";
  const cat = product.cat ?? "";
  const desc = product.desc ?? "";

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.imgContainer}>
          <Image src={product.img || "/noavatar.png"} alt="" fill />
        </div>
        {title}
      </div>
      <div className={styles.formContainer}>
        <form action={updateProduct} className={styles.form}>
          {/* pass a primitive string id */}
          <input type="hidden" name="id" value={pid} />

          <label>Title</label>
          <input type="text" name="title" defaultValue={title} />

          <label>Price</label>
          <input type="number" name="price" defaultValue={price} />

          <label>Stock</label>
          <input type="number" name="stock" defaultValue={stock} />

          <label>Color</label>
          <input type="text" name="color" defaultValue={color || ""} />

          <label>Size</label>
          <textarea name="size" defaultValue={size || ""} />

          <label>Cat</label>
          <select name="cat" id="cat" defaultValue={cat || "kitchen"}>
            <option value="kitchen">Kitchen</option>
            <option value="computers">Computers</option>
          </select>

          <label>Description</label>
          <textarea
            name="desc"
            id="desc"
            rows="10"
            defaultValue={desc || ""}
          />

          <button>Update</button>
        </form>
      </div>
    </div>
  );
};

export default SingleProductPage;
