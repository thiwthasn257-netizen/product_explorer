"use server";

import { auth } from "@/app/lib/auth";
import {
  deleteProduct,
  ProductDraftSchema,
  updateProduct,
} from "@/app/lib/products";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function updateProductAction(id: string, formData: FormData) {
  await requireUser();

  const titleValue = formData.get("title");
  const descriptionValue = formData.get("description");
  const priceValue = formData.get("price");
  const stockValue = formData.get("stock");
  const categoryValue = formData.get("category");
  const title = typeof titleValue === "string" ? titleValue.trim() : "";
  const description =
    typeof descriptionValue === "string" ? descriptionValue.trim() : "";
  const price =
    typeof priceValue === "string" && priceValue.trim() !== ""
      ? Number(priceValue)
      : Number.NaN;
  const stock =
    typeof stockValue === "string" && stockValue.trim() !== ""
      ? Number(stockValue)
      : Number.NaN;
  const product = ProductDraftSchema.safeParse({
    title,
    description,
    price,
    stock,
    category: categoryValue,
  });
  if (!product.success) {
    throw new Error(product.error.issues[0]?.message ?? "ข้อมูลสินค้าไม่ถูกต้อง");
  }

  await updateProduct(id, product.data);

  revalidatePath("/");
  redirect("/");
}

export async function deleteProductAction(id: string) {
  await requireUser();
  await deleteProduct(id);
  revalidatePath("/");
  redirect("/");
}