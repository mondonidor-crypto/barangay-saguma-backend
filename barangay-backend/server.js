const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 SUPABASE CONNECTION (we set later in Render)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// 🔐 LOGIN (single admin only)
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "barangay123") {
    return res.json({ success: true });
  }

  return res.status(401).json({ success: false });
});

// 👥 ADD RESIDENT
app.post("/residents", async (req, res) => {
  const { fullname, address, birthdate, civil_status } = req.body;

  const { data, error } = await supabase
    .from("residents")
    .insert([{ fullname, address, birthdate, civil_status }]);

  res.json({ data, error });
});

// 📄 CREATE CERTIFICATE
app.post("/certificate", async (req, res) => {
  const { name, type, purpose } = req.body;

  const cert_id = "SAGUMA-" + Date.now();

  const { data, error } = await supabase
    .from("certificates")
    .insert([
      {
        cert_id,
        name,
        type,
        purpose,
        date_issued: new Date()
      }
    ]);

  res.json({ cert_id, data, error });
});

app.listen(5000, () => {
  console.log("Barangay Saguma backend running on port 5000");
});
