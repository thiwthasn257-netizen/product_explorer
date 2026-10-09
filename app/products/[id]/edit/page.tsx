import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { updateProductAction } from "@/app/actions";
import { auth } from "@/app/lib/auth";
import { CATEGORIES, getProduct } from "@/app/lib/products";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const { id } = await params;
  const product = await getProduct(id);
  if (!product) {
    notFound();
  }

  const updateAction = updateProductAction.bind(null, String(product.id));

  return (
    <main className="page-card">
      <Link className="back-link" href="/">← กลับไปหน้ารายการสินค้า</Link>
      <div className="page-heading">
        <div>
          <p className="eyebrow">จัดการสินค้า · #{product.id}</p>
          <h1>แก้ไขสินค้า</h1>
          <p className="page-description">ปรับข้อมูลสินค้าแล้วกดบันทึกเพื่อยืนยัน</p>
        </div>
      </div>
      <form className="edit-form" action={updateAction}>
        <div>
          <label htmlFor="title">ชื่อสินค้า</label>
          <input
            id="title"
            name="title"
            defaultValue={product.title}
            required
          />
        </div>
        <div>
          <label htmlFor="price">ราคา</label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            defaultValue={product.price}
            required
          />
        </div>
        <div>
          <label htmlFor="stock">จำนวนคงเหลือ</label>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            step="1"
            defaultValue={product.stock}
            required
          />
        </div>
        <div>
          <label htmlFor="category">หมวดหมู่</label>
          <select
            id="category"
            name="category"
            defaultValue={product.category}
            required
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="description">รายละเอียด</label>
          <textarea
            id="description"
            name="description"
            defaultValue={product.description ?? ""}
          />
        </div>
        <div>
          <button type="submit">บันทึก</button>
          <Link className="button button-secondary" href="/">ยกเลิก</Link>
        </div>
      </form>
    </main>
  );
}
