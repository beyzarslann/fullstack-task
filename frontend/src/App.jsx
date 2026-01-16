import { useEffect, useState } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";

export default function App() {
  const [token, setToken] = useState("");
  const [status, setStatus] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    onMessage(messaging, (payload) => {
      const title = payload?.notification?.title || "USDT Alert";

      const from = payload?.data?.f || "";
      const to = payload?.data?.t || "";
      const amount = payload?.data?.a || "";
      const tx = payload?.data?.h || "";

      setItems((old) => [
        {
          title,
          from,
          to,
          amount,
          tx,
          time: new Date().toLocaleString(),
        },
        ...old,
      ]);
    });
  }, []);

  async function enable() {
    try {
      setStatus("İzin isteniyor...");

      const ok = await Notification.requestPermission();
      if (ok !== "granted") {
        setStatus("İzin yok");
        return;
      }

      const reg = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );

      setStatus("token alınıyor");

      const vapidKey =
        "BAZ6y48RvX2nrtcK0cErk9ueVHrfqSszLQXhgCFuArDrfM_DNXSGsz5K9pxqqJw4GM1XENQ4T2gXn50kkd6bEBQ";

      const t = await getToken(messaging, {
        vapidKey,
        serviceWorkerRegistration: reg,
      });
      if (!t) {
        setStatus("Token gelmedi");
        return;
      }

      setToken(t);
      setStatus("Subscribe...");

      await fetch("http://localhost:3000/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: t }),
      });

      setStatus("✅ Hazır");
    } catch (e) {
      console.log(e);
      setStatus("Hata (console)");
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <button onClick={enable}>Bildirimleri Aç</button>
      <p>{status}</p>

      {token && (
        <>
          <h4>Token</h4>
          <textarea value={token} readOnly rows={4} style={{ width: "100%" }} />
        </>
      )}

      <hr />

      <h3>Bildirimler</h3>

      {items.length === 0 ? <p>Henüz yok</p> : null}

      {items.map((x, i) => (
        <div
          key={i}
          style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}
        >
          <b>{x.title}</b>
          <div style={{ fontSize: 12, opacity: 0.7 }}>{x.time}</div>
          <div>From: {x.from}</div>
          <div>To: {x.to}</div>
          <div>Amount: {x.amount}</div>
          <div style={{ wordBreak: "break-all" }}>Tx: {x.tx}</div>
        </div>
      ))}
    </div>
  );
}
