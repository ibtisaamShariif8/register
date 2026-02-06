const form = document.getElementById("regForm");
const msg = document.getElementById("msg");

// Inputs
const fullnameInput = document.getElementById("fullname");
const nidInput = document.getElementById("nid");
const dobInput = document.getElementById("dob");
const genderInput = document.getElementById("gender");
const addressInput = document.getElementById("address");

// ================= HELPER =================
function setError(input) {
  input.style.border = "2px solid red";
}

function setSuccess(input) {
  input.style.border = "2px solid green";
}

function truncate(text, max) {
  return text.length > max ? text.substring(0, max) : text;
}

function clearBorders() {
  document.querySelectorAll("input, select").forEach(i => {
    i.style.border = "1px solid #ccc";
  });
}

// ================= DATE HELPERS =================
function is18OrOlder(dateString) {
  const today = new Date();
  const dob = new Date(dateString);
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age >= 18;
}

// prevent future dates
dobInput.max = new Date().toISOString().split("T")[0];

// ================= LIVE VALIDATION =================
function validateInput(input) {
  const value = input.value.trim();
  const textOnly = /^[A-Za-z\s]+$/;

  switch (input.id) {
    case "fullname":
      if (value === "" || value.length < 6 || value.length > 15 || !textOnly.test(value))
        setError(input);
      else setSuccess(input);
      break;

    case "nid":
      if (value === "" || value.length > 8)
        setError(input);
      else setSuccess(input);
      break;

    case "dob":
      if (
        value === "" ||
        new Date(value) > new Date() ||
        !is18OrOlder(value)
      ) {
        setError(input);
      } else {
        setSuccess(input);
      }
      break;

    case "gender":
      if (value === "")
        setError(input);
      else setSuccess(input);
      break;

    case "address":
      if (value === "" || !textOnly.test(value))
        setError(input);
      else setSuccess(input);
      break;
  }
}

// Live events
[fullnameInput, nidInput, dobInput, genderInput, addressInput].forEach(input => {
  input.addEventListener("input", () => validateInput(input));
  input.addEventListener("blur", () => validateInput(input));
});

// ================= SUBMIT =================
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const fullname = fullnameInput.value.trim();
  const nid = nidInput.value.trim();
  const dob = dobInput.value;
  const gender = genderInput.value;
  const address = addressInput.value.trim();
  const textOnly = /^[A-Za-z\s]+$/;

  [fullnameInput, nidInput, dobInput, genderInput, addressInput]
    .forEach(input => validateInput(input));

  if (
    fullname === "" || fullname.length < 6 || fullname.length > 15 || !textOnly.test(fullname) ||
    nid === "" || nid.length > 8 ||
    dob === "" || new Date(dob) > new Date() || !is18OrOlder(dob) ||
    gender === "" ||
    address === "" || !textOnly.test(address)
  ) {
    msg.innerText = "Fadlan geli taariikh sax ah (18+ jir, future date ma aha)";
    msg.style.color = "red";
    return;
  }

  const citizen = {
    fullname: truncate(fullname, 12),
    nid: truncate(nid, 8),
    dob,
    gender,
    address: truncate(address, 15)
  };

  let citizens = JSON.parse(localStorage.getItem("citizens")) || [];
  citizens.push(citizen);
  localStorage.setItem("citizens", JSON.stringify(citizens));

  msg.innerText = "Citizen Registered Successfully ✔";
  msg.style.color = "green";

  form.reset();
  clearBorders();
});
