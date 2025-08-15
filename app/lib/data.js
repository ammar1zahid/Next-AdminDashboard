import { Product, User } from "./models";
import connect from "./utils";


// export const fetchUsers = async (q,page) => {
 
//   const regex = new RegExp(q, "i");
//   const ITEM_PER_PAGE = 2;

//   try {
//     await connect();
//     // const users = await User.find();
//     // return users
//     const count = await User.find({ username: { $regex: regex } }).count();
//     const users = await User.find({ username: { $regex: regex } })
//       .limit(ITEM_PER_PAGE)
//       .skip(ITEM_PER_PAGE * (page - 1));
//     return { count, users };
//   } catch (err) {
//     console.log(err);
//     throw new Error("Failed to fetch users!");
//   }
// };


export const fetchUsers = async (q = "", page = 1) => {
  // normalize inputs
  const query = (typeof q === "string" ? q : "").trim();
  page = parseInt(page, 10) || 1;
  if (page < 1) page = 1;

  const ITEM_PER_PAGE = 2;
  const regex = new RegExp(query || "", "i"); // empty string matches all

  try {
    await connect();

    const filter = { username: { $regex: regex } };

    // count documents that match the filter
    const count = await User.countDocuments(filter);

    // fetch paginated results
    const users = await User.find(filter)
      // .sort({ createdAt: -1 }) // newest first (optional)
      .skip(ITEM_PER_PAGE * (page - 1))
      .limit(ITEM_PER_PAGE)
      .lean(); // returns plain JS objects instead of Mongoose docs

    return { count, users };
  } catch (err) {
    console.error("fetchUsers error:", err);
    throw new Error("Failed to fetch users!");
  }
};


export const fetchUser = async (id) => {
  console.log(id);
  try {
    connect();
    const user = await User.findById(id);
    return user;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch user!");
  }
};

export const fetchProducts = async (q, page) => {
  // normalize inputs
  const query = (typeof q === "string" ? q : "").trim();
  page = parseInt(page, 10) || 1;
  if (page < 1) page = 1;

  const ITEM_PER_PAGE = 2;
  const regex = new RegExp(query || "", "i"); // empty string matches all

  try {
    await connect();

    const filter = { title: { $regex: regex } };

    // count documents that match the filter
    const count = await Product.countDocuments(filter);

    // fetch paginated results
    const products = await Product.find(filter)
      // .sort({ createdAt: -1 }) // newest first (optional)
      .skip(ITEM_PER_PAGE * (page - 1))
      .limit(ITEM_PER_PAGE)
      .lean(); // returns plain JS objects instead of Mongoose docs
    return { count, products };
  } catch (err) {
    console.error("fetchProduct error:", err);
    throw new Error("Failed to fetch products!");
  }
  
};

export const fetchProduct = async (id) => {
  try {
    connect();
    const product = await Product.findById(id);
    return product;
  } catch (err) {
    console.log("error in fetchProduct: ",err);
    throw new Error("Failed to fetch product!");
  }
};











// DUMMY DATA

export const cards = [
  {
    id: 1,
    title: "Total Users",
    number: 10.928,
    change: 12,
  },
  {
    id: 2,
    title: "Stock",
    number: 8.236,
    change: -2,
  },
  {
    id: 3,
    title: "Revenue",
    number: 6.642,
    change: 18,
  },
];