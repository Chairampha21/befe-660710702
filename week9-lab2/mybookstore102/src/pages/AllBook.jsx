import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/solid";
import { BookOpenIcon, LogoutIcon } from "@heroicons/react/outline";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

const AllBook = () => {
  const navigate = useNavigate();

  // ---------- state ----------
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ---------- auth (ออปชัน) ----------
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAdminAuthenticated");
    if (!isAuthenticated) navigate("/login");
  }, [navigate]);

  // ---------- fetch list ----------
  useEffect(() => {
    const ac = new AbortController();

    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);

        // รองรับทั้ง array และ { data: [...] }
        const res = await fetch(`${API_BASE}/api/v1/books`, {
          cache: "no-store",
          signal: ac.signal,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        const text = await res.text(); // อ่าน response เป็น text ก่อน
        
        if (!res.ok) {
          throw new Error(`Failed to fetch books (${res.status}): ${text}`);
        }

        // พยายามแปลง text เป็น JSON
        let raw;
        try {
          raw = JSON.parse(text);
        } catch (e) {
          console.error('Invalid JSON response:', text);
          throw new Error('Invalid JSON response from server');
        }

        console.log('API Response:', raw); // For debugging
        
        const arr = Array.isArray(raw) ? raw : (raw?.data || []);
        if (!Array.isArray(arr)) {
          throw new Error('Invalid data format received from API');
        }
        
        // แปลงค่า null และจัดการค่าที่อาจจะเป็น undefined
        const sanitizedBooks = arr.map(book => {
          // ถ้า book เป็น null หรือ undefined ให้ใช้ object ว่าง
          if (!book) return {
            id: '',
            title: '',
            author: '',
            isbn: '',
            year: '',
            price: 0,
            category: ''
          };

          return {
            id: book.id?.toString() || '',
            title: book.title?.toString() || '',
            author: book.author?.toString() || '',
            isbn: book.isbn?.toString() || '',
            year: book.year?.toString() || '',
            price: Number(book.price) || 0,
            category: book.category?.toString() || ''
          };
        });
        
        setBooks(sanitizedBooks);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error fetching books:", err);
          setError(err.message || "เกิดข้อผิดพลาดในการดึงข้อมูล");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
    return () => ac.abort();
  }, []);

  // ---------- actions ----------
  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated");
    navigate("/login");
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("ต้องการลบหนังสือเล่มนี้ใช่หรือไม่?");
    if (!ok) return;

    // optimistic update
    const prev = books;
    setBooks((b) => b.filter((x) => String(x.id) !== String(id)));

    try {
      const res = await fetch(`${API_BASE}/api/v1/books/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error(`Delete failed (${res.status})`);
      }
    } catch (err) {
      console.error("Error deleting book:", err);
      alert("ลบไม่สำเร็จ ระบบจะคืนค่าเดิมให้");
      setBooks(prev); // rollback
    }
  };

  const handleEdit = (book) => {
    navigate(`/books/${book.id}`, { state: { book } });
  };

  const goDetail = (book) => {
    navigate(`/books/${book.id}`, { state: { book } });
  };

  // ✅ ใช้ relative path สำหรับ nested routes ใต้ /store-manager
  const handleAddBook = () => {
    navigate("/store-manager/add-book");
    // ถ้าไม่ได้ใช้ nested routes ให้ใช้แบบนี้แทน:
    // navigate("/store-manager/add-book");
  };

  // ---------- helpers ----------
  const fmtPrice = (v) =>
    Number(v ?? 0).toLocaleString("th-TH", { maximumFractionDigits: 0 });

  const rows = useMemo(() => books ?? [], [books]);

  // ---------- UI ----------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 animate-pulse">
        กำลังโหลดข้อมูล...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-xl text-red-600 mb-3">Error: {error}</div>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700"
        >
          ลองใหม่
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ===== Header / App Bar ===== */}
      <header className="bg-gradient-to-r from-sky-600 to-green-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <BookOpenIcon className="h-8 w-8" />
              <h1 className="text-2xl font-bold">BookStore - BackOffice</h1>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <LogoutIcon className="h-5 w-5" />
              <span>ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </header>

      {/* ===== Main ===== */}
      <main className="container mx-auto px-4 py-10">
        {/* Page Title + Add Button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">รายการหนังสือทั้งหมด</h2>
          <button
            type="button"
            onClick={handleAddBook}
            className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-5 py-2 rounded-lg flex items-center gap-2 transition-all"
          >
            <PlusIcon className="h-5 w-5" />
            เพิ่มหนังสือใหม่
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full border border-gray-200 bg-white">
            <thead className="bg-sky-100">
              <tr>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">ลำดับ</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">ชื่อหนังสือ</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">ผู้แต่ง</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">ISBN</th>
                <th className="py-3 px-4 text-center font-semibold text-gray-700">ปีที่พิมพ์</th>
                <th className="py-3 px-4 text-right font-semibold text-gray-700">ราคา (บาท)</th>
                <th className="py-3 px-4 text-center font-semibold text-gray-700">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? (
                rows.map((book, index) => (
                  <tr key={book.id} className="border-t hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">{index + 1}</td>
                    <td
                      className="py-3 px-4 font-medium text-sky-700 cursor-pointer underline"
                      onClick={() => goDetail(book)}
                      title="ดูรายละเอียด"
                    >
                      {book.title || '-'}
                    </td>
                    <td className="py-3 px-4 text-gray-700">{book.author || '-'}</td>
                    <td className="py-3 px-4 text-gray-700">{book.isbn || '-'}</td>
                    <td className="py-3 px-4 text-center text-gray-700">{book.year || '-'}</td>
                    <td className="py-3 px-4 text-right text-gray-700">{fmtPrice(book.price)}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleEdit(book)}
                          className="bg-yellow-400 hover:bg-yellow-300 text-black px-3 py-2 rounded-lg flex items-center gap-1 transition"
                        >
                          <PencilIcon className="h-5 w-5" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(book.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 transition"
                        >
                          <TrashIcon className="h-5 w-5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500 italic">
                    ไม่มีข้อมูลหนังสือ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AllBook;