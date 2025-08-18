"use server";

import { revalidatePath } from "next/cache";
import { Product, User } from "./models";
import connect from "./utils";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";


// ✅ Add User
export async function addUser(formData) {
  const { username, email, password, phone, address, isAdmin, isActive } =
    Object.fromEntries(formData);

  try {
    await connect();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phone,
      address,
      isAdmin,
      isActive,
    });

    await newUser.save();
  } catch (err) {
    console.error(err);
    throw new Error("Failed to create user!");
  }

  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
}

// ✅ Update User
export async function updateUser(formData) {
  const { id, username, email, phone, address, isAdmin, isActive } =
    Object.fromEntries(formData);

  try {
    await connect();

    await User.findByIdAndUpdate(id, {
      username,
      email,
      phone,
      address,
      isAdmin,
      isActive,
    });
  } catch (err) {
    console.error(err);
    throw new Error("Failed to update user!");
  }

  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
}

// ✅ Delete User
export async function deleteUser(formData) {
  const { id } = Object.fromEntries(formData);

  try {
    await connect();

    await User.findByIdAndDelete(id);
  } catch (err) {
    console.error(err);
    throw new Error("Failed to delete user!");
  }

  revalidatePath("/dashboard/users");
}

// ✅ Add Product
export async function addProduct(formData) {
  const { title, desc, price, stock, color, size } =
    Object.fromEntries(formData);

  try {
    await connect();

    const newProduct = new Product({
      title,
      desc,
      price,
      stock,
      color,
      size,
    });

    await newProduct.save();
  } catch (err) {
    console.error(err);
    throw new Error("Failed to create product!");
  }

  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
}

// ✅ Update Product
export async function updateProduct(formData) {
  const { id, title, desc, price, stock, color, size } =
    Object.fromEntries(formData);

  try {
    await connect();

    await Product.findByIdAndUpdate(id, {
      title,
      desc,
      price,
      stock,
      color,
      size,
    });
  } catch (err) {
    console.error(err);
    throw new Error("Failed to update product!");
  }

  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
}

// ✅ Delete Product
export async function deleteProduct(formData) {
  const { id } = Object.fromEntries(formData);

  try {
    await connect();

    await Product.findByIdAndDelete(id);
  } catch (err) {
    console.error(err);
    throw new Error("Failed to delete product!");
  }

  revalidatePath("/dashboard/products");
}
