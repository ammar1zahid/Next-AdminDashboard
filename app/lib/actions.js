"use server";

import { revalidatePath } from "next/cache";
import { Product, User } from "./models";
import connect from "./utils";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import mongoose from "mongoose";


// import { signIn } from "../auth";

export const addUser = async (formData) => {
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
    console.log(err);
    throw new Error("Failed to create user!");
  }

  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
};

          


export const updateUser = async (formData) => {
  // formData is a FormData instance; convert to plain object
  const payload = Object.fromEntries(formData);
  const { id } = payload;

  try {
    // validate id first
    if (!id || typeof id !== "string" || !mongoose.isValidObjectId(id)) {
      console.warn("updateUser called with invalid id:", id);
      throw new Error("Invalid user id");
    }

    await connect(); // IMPORTANT: await DB connection

    // normalize & parse fields
    const updateFields = {};

    if (payload.username && String(payload.username).trim() !== "") {
      updateFields.username = String(payload.username).trim();
    }
    if (payload.email && String(payload.email).trim() !== "") {
      updateFields.email = String(payload.email).trim();
    }
    // Only update password if provided (you should hash it here in real app)
    if (payload.password && String(payload.password).trim() !== "") {
      updateFields.password = String(payload.password);
      // TODO: hash password before saving (bcrypt)
    }
    if (payload.phone && String(payload.phone).trim() !== "") {
      updateFields.phone = String(payload.phone).trim();
    }
    if (payload.address && String(payload.address).trim() !== "") {
      updateFields.address = String(payload.address).trim();
    }

    // Parse booleans (form values are strings)
    if (typeof payload.isAdmin !== "undefined") {
      updateFields.isAdmin = String(payload.isAdmin) === "true";
    }
    if (typeof payload.isActive !== "undefined") {
      updateFields.isActive = String(payload.isActive) === "true";
    }

    // If nothing to update, skip DB call
    if (Object.keys(updateFields).length === 0) {
      console.log("No fields to update for user:", id);
    } else {
      await User.findByIdAndUpdate(id, updateFields, { new: true });
    }

    // Revalidate and redirect
    revalidatePath("/dashboard/users");
    redirect("/dashboard/users");
  } catch (err) {
    console.error("error in updateUser", err);
    throw err; 
  }
};


export const addProduct = async (formData) => {
  const { title, desc, price, stock, color, size } =
    Object.fromEntries(formData);

  try {
    connect();

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
    console.log(err);
    throw new Error("Failed to create product!");
  }

  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
};

export const updateProduct = async (formData) => {
  const { id, title, desc, price, stock, color, size } =
    Object.fromEntries(formData);

  try {
    connect();

    const updateFields = {
      title,
      desc,
      price,
      stock,
      color,
      size,
    };

    Object.keys(updateFields).forEach(
      (key) =>
        (updateFields[key] === "" || undefined) && delete updateFields[key]
    );

    await Product.findByIdAndUpdate(id, updateFields);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to update product!");
  }

  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
};

export const deleteUser = async (formData) => {
  const { id } = Object.fromEntries(formData);

  try {
    connect();
    await User.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to delete user!");
  }

  revalidatePath("/dashboard/products");
};

export const deleteProduct = async (formData) => {
  const { id } = Object.fromEntries(formData);

  try {
    connect();
    await Product.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to delete product!");
  }

  revalidatePath("/dashboard/products");
};

// export const authenticate = async (prevState, formData) => {
//   const { username, password } = Object.fromEntries(formData);

//   try {
//     await signIn("credentials", { username, password });
//   } catch (err) {
//     console.log("error in authenticate action: ", err)
//     if (err.message.includes("CredentialsSignin")) {
//       return "Wrong Credentials";
//     }
//     throw err;
//   }
// };
