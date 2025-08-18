import Link from "next/link";
import styles from "../../components/dashboard/products/products.module.css";
import Search from "@/app/components/dashboard/search/search";
import Image from "next/image";
import Pagination from "@/app/components/dashboard/pagination/pagination";
import { fetchProducts } from "@/app/lib/data";
import { deleteProduct } from "@/app/lib/actions";
export const dynamic = "force-dynamic";

const ProductsPage = async ({ searchParams }) => {
  // await searchParams before reading its props
  const params = await searchParams;
  const q = params?.q || "";
  const page = params?.page || 1;

  let count = 0;
  let products = [];

  try {
    const result = await fetchProducts(q, page);
    count = result?.count || 0;
    products = result?.products || [];
  } catch (err) {
    console.error("ProductsPage error:", err);
    // Safe fallback
    count = 0;
    products = [];
  }

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
          {products.length > 0 ? (
            products.map((product) => {
              const id = String(product._id ?? product.id ?? "");
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
                        <input type="hidden" name="id" value={id} />
                        <button
                          className={`${styles.button} ${styles.delete}`}
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Pagination count={count} />
    </div>
  );
};

export default ProductsPage;
