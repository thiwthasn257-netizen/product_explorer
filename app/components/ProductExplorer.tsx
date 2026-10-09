"use client";

// useState = เก็บข้อมูลและสถานะ
// useEffect = เรียก API ตอนเปิดหน้า
import { useEffect, useState } from "react";
import Link from "next/link";

import ProductSearchForm from "./ProductSearchForm";
import ProductForm from "./ProductForm";

import {
  defaultQuery,
  fetchProducts,
} from "../lib/products";

import type {
  Product,
  ProductDraft,
  ProductList,
  SearchQuery,
} from "../lib/products";

// สถานะของการโหลดข้อมูล
type LoadState =
  | "loading" // กำลังโหลด
  | "error"   // โหลดไม่สำเร็จ
  | "ready";  // โหลดสำเร็จ

export default function ProductExplorer({
  isLoggedIn,
}: {
  isLoggedIn: boolean;
}) {

  // เก็บรายการสินค้า
  const [products, setProducts] =
    useState<Product[]>([]);

  // เก็บสถานะการโหลด
  const [status, setStatus] =
    useState<LoadState>("loading");

  // เก็บข้อความ Error
  const [errorMessage, setErrorMessage] =
    useState("");

  // ทำงานเมื่อโหลดข้อมูลสำเร็จ
  function showResult(list: ProductList) {
    setProducts(list.products);
    setStatus("ready");
  }


  // ทำงานเมื่อเกิด Error
  function showError(error: unknown) {
    setErrorMessage(
      error instanceof Error
        ? error.message
        : "เรียกข้อมูลไม่สำเร็จ"
    );

    setStatus("error");
  }


  // ฟังก์ชันสำหรับค้นหาและโหลดสินค้า
  async function loadProducts(
    query: SearchQuery
  ) {
    // เปลี่ยนสถานะเป็นกำลังโหลด
    setStatus("loading");

    setErrorMessage("");

    try {
      // เรียก API แล้วแสดงผล
      showResult(
        await fetchProducts(query)
      );
    } catch (error) {
      // ถ้าเกิด Error ให้แสดง Error
      showError(error);
    }
  }


  // เรียก API อัตโนมัติเมื่อเปิดหน้าเว็บ
  useEffect(() => {
    fetchProducts(defaultQuery)
      .then(showResult)
      .catch(showError);
  }, []);


  // เพิ่มสินค้า
  function saveProduct(
    draft: ProductDraft
  ) {
    setProducts([
      ...products,
      {
        ...draft,
        id: Date.now(),
        thumbnail: "",
      },
    ]);
  }


  return (
    <main className="product-dashboard">
      <div className="page-heading">
        <div>
          <p className="eyebrow">คลังสินค้า</p>
          <h1>รายการสินค้า</h1>
          <p className="page-description">
            ค้นหาและจัดการรายการสินค้าของคุณได้ในที่เดียว
          </p>
        </div>
        <span className="status-pill">
          <span className="status-dot" />
          {status === "loading" ? "กำลังโหลด" : "สินค้า"}
        </span>
      </div>

      <button
        className="button button-secondary reload-button"
        type="button"

        // กดเพื่อโหลดข้อมูลใหม่
        onClick={() =>
          loadProducts(defaultQuery)
        }

        // ปิดปุ่มระหว่างกำลังโหลด
        disabled={status === "loading"}
      >
        {status === "loading"
          ? "กำลังโหลด"
          : "โหลดข้อมูล"}
      </button>


      {/* ฟอร์มค้นหา ส่งฟังก์ชัน loadProducts ไปให้ */}
      <ProductSearchForm
        onSearch={loadProducts}
      />


      <ProductForm
        editing={null}
        onSave={saveProduct}
      />


      {/* aria-live ช่วยให้โปรแกรมอ่านหน้าจอรู้ว่าข้อมูลเปลี่ยน */}
      <section aria-live="polite">

        {/* แสดงตอนกำลังโหลด */}
        {status === "loading" && (
          <p>กำลังโหลดข้อมูล</p>
        )}


        {/* แสดงเมื่อเกิด Error */}
        {status === "error" && (
          <p role="alert">
            {errorMessage}
          </p>
        )}


        {/* โหลดสำเร็จแต่ไม่พบสินค้า */}
        {status === "ready" &&
          products.length === 0 && (
            <p>
              ไม่พบสินค้าที่ตรงกับเงื่อนไข
            </p>
          )}


        {/* ถ้ามีสินค้า ให้แสดงตาราง */}
        {status === "ready" &&
          products.length > 0 && (

            <table>
              <thead>
                <tr>
                  <th>รูป</th>
                  <th>ชื่อสินค้า</th>
                  <th>ราคา</th>
                  <th>คงเหลือ</th>
                  <th>หมวดหมู่</th>
                  <th>จัดการ</th>
                </tr>
              </thead>

              <tbody>

                {/* map วนแสดงสินค้าทุกตัว */}
                {products.map((item) => (
                  <tr key={item.id}>

                    <td>
                      {item.thumbnail && (
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          width={80}
                        />
                      )}
                    </td>

                    <td>
                      {item.title}
                    </td>

                    <td>
                      {item.price}
                    </td>

                    <td>
                      {item.stock}
                    </td>

                    <td>
                      {item.category}
                    </td>

                    <td>

                      {isLoggedIn && (
                        <div className="row-actions">
                          <Link className="action-link" href={`/products/${item.id}/edit`}>
                            แก้ไข
                          </Link>
                          <Link className="action-link action-link-danger" href={`/products/${item.id}/delete`}>
                            ลบ
                          </Link>
                        </div>
                      )}

                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          )}

      </section>
    </main>
  );
}