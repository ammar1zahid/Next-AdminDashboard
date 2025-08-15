import Link from "next/link";
import styles from "../../components/dashboard/products/products.module.css";
import Search from "@/app/components/dashboard/search/search";
import Image from "next/image";
import Pagination from "@/app/components/dashboard/pagination/pagination";
import { fetchProducts } from "@/app/lib/data";
import { deleteProduct } from "@/app/lib/actions";

const ProductsPage = async (props) => {
  const searchParams = await props.searchParams;
  const q = searchParams?.q || "";
  const page = searchParams?.page || 1;
  const { count, products = [] } = await fetchProducts(q, page);

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search placeholder="Search for a product..." />
        <Link href="/dashboard/products/add">
          <button className={styles.addButton}>Add New</button>
        </Link>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <td>Title</td>
            <td>Description</td>
            <td>Price</td>
            <td>Created At</td>
            <td>Stock</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const id = String(product._id); // <-- convert to primitive string
            const created = product.createdAt
              ? new Date(product.createdAt).toString().slice(4, 16)
              : "";

            return (
              <tr key={id}>
                <td>
                  <div className={styles.product}>
                    <Image
                      src={product.img || "/noproduct.jpg"}
                      alt=""
                      width={40}
                      height={40}
                      className={styles.productImage}
                    />
                    {product.title}
                  </div>
                </td>
                <td>{product.desc}</td>
                <td>${product.price}</td>
                <td>{created}</td>
                <td>{product.stock}</td>
                <td>
                  <div className={styles.buttons}>
                    <Link href={`/dashboard/products/${id}`}>
                      <button className={`${styles.button} ${styles.view}`}>
                        View
                      </button>
                    </Link>

                    <form action={deleteProduct}>
                      {/* pass a string, not an ObjectId */}
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
};

export default ProductsPage;
