import { useState, useEffect, useCallback } from "react";
import Header from "./components/Header";
import RingkasanGerai from "./components/RingkasanGerai";
import FormGerai from "./components/FormGerai";
import DaftarGerai from "./components/DaftarGerai";
import "./App.css";

function App() {
  const [dataGerai, setDataGerai] = useState([
    { id: 1, nama: "Warung Sugema", wilayah: "Bandung", ongkir: 0 },
    { id: 2, nama: "Lestari", wilayah: "Bandung", ongkir: 1000 },
    { id: 3, nama: "Dongmoon", wilayah: "Sekitar Telkom", ongkir: 0 },
    { id: 4, nama: "Chinese Food", wilayah: "Sekitar Telkom", ongkir: 0 },
    { id: 5, nama: "Kantin Pahlawan", wilayah: "Sukapura", ongkir: 0 },
  ]);

  const [formData, setFormData] = useState({
    nama: "",
    wilayah: "",
    ongkir: "",
  });

  const [dataAPI, setDataAPI] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    const geraiBaru = {
      id: Date.now(),
      nama: formData.nama,
      wilayah: formData.wilayah,
      ongkir: formData.ongkir,
    };

    setDataGerai([...dataGerai, geraiBaru]);

    setFormData({
      nama: "",
      wilayah: "",
      ongkir: "",
    });
  }

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );

      if (!response.ok) {
        throw new Error("Gagal mengambil data dari API");
      }

      const hasil = await response.json();
      setDataAPI(hasil.slice(0, 5));
    } catch (err) {
      setError("Data gagal dimuat. Silakan coba lagi.");
      console.error("Terjadi kesalahan:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="app">
      <Header />

      <main className="main-content">
        <div className="page-heading">
          <div>
            <p className="eyebrow">DASHBOARD</p>
            <h2>Kelola Data Gerai</h2>
            <p>
              Kelola informasi gerai dan ongkos kirim
              dengan mudah.
            </p>
          </div>
        </div>

        <RingkasanGerai jumlahGerai={dataGerai.length} />

        <div className="content-grid">
          <FormGerai
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />

          <DaftarGerai dataGerai={dataGerai} />
        </div>

        <section className="panel api-panel">
          <h2>Informasi Kuliner Tambahan</h2>
          <p className="panel-description">
            Informasi tambahan yang diambil dari sumber data API.
          </p>

          {loading && (
            <p className="api-message">Sedang memuat data...</p>
          )}

          {!loading && error && (
            <div className="api-error">
              <p>{error}</p>
              <button
                type="button"
                className="api-retry"
                onClick={fetchData}
              >
                Coba Lagi
              </button>
            </div>
          )}

          {!loading && !error && (
            <div className="api-list">
              {dataAPI.map((item) => (
                <article className="api-card" key={item.id}>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>© 2026 InfoDeliv - Informasi Layanan Delivery</p>
      </footer>
    </div>
  );
}

export default App;