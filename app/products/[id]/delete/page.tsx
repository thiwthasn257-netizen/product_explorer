import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { deleteProductAction } from "@/app/actions";
import { auth } from "@/app/lib/auth";
import { getProduct } from "@/app/lib/products";

type DeleteProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DeleteProductPage({
  params,
}: DeleteProductPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const { id } = await params;
  const product = await getProduct(id);
  if (!product) {
    notFound();
  }

  const deleteAction = deleteProductAction.bind(null, String(product.id));

  return (
    <main className="page-card">
      <Link className="back-link" href="/">← กลับไปหน้ารายการสินค้า</Link>
      <section className="delete-confirmation">
        <span className="delete-icon" aria-hidden="true">!</span>
        <p className="eyebrow">ยืนยันการดำเนินการ · #{product.id}</p>
        <h1>ลบสินค้านี้?</h1>
        <p className="confirmation-copy">
          คุณกำลังจะลบ <strong>“{product.title}”</strong> การดำเนินการนี้ไม่สามารถย้อนกลับได้
        </p>
        <div className="confirmation-actions">
          <form className="delete-form" action={deleteAction}>
            <button className="button button-danger" type="submit">
              ยืนยันการลบ
            </button>
          </form>
          <Link className="button button-secondary" href="/">ยกเลิก</Link>
        </div>
      </section>
    </main>
  );
}
