const certificates = [
  ["api.keytrace.io", "Platform", "TLS", "DigiCert", "Nov 18, 2026", "16 days", "Expiring soon"],
  ["payments.keytrace.io", "Payments", "mTLS", "Internal CA", "Dec 04, 2026", "32 days", "Expiring soon"],
  ["admin.keytrace.io", "Security", "TLS", "Let's Encrypt", "May 09, 2028", "554 days", "Active"],
  ["mobile.keytrace.io", "Mobile", "TLS", "DigiCert", "Dec 18, 2026", "46 days", "Active"],
  ["legacy.keytrace.io", "Infrastructure", "TLS", "Internal CA", "Oct 25, 2026", "8 days ago", "Expired"],
  ["vpn.keytrace.io", "Security", "mTLS", "Internal CA", "Jan 12, 2027", "71 days", "Active"],
  ["signing.keytrace.io", "Platform", "Code signing", "DigiCert", "Mar 21, 2027", "139 days", "Active"],
]

const sidebar = document.getElementById("sidebar")
const scrim = document.getElementById("scrim")
const menuButton = document.getElementById("menuButton")

menuButton?.addEventListener("click", () => {
  sidebar?.classList.add("open")
  scrim?.classList.add("show")
})

scrim?.addEventListener("click", () => {
  sidebar?.classList.remove("open")
  scrim.classList.remove("show")
})

document.querySelectorAll(".go-inventory").forEach((button) => {
  button.addEventListener("click", () => {
    window.location.href = "inventory.html"
  })
})

function renderCertificates() {
  const rows = document.getElementById("certificateRows")
  if (!rows) return

  const query = document.getElementById("certificateSearch").value.toLowerCase()
  const status = document.getElementById("statusFilter").value
  const type = document.getElementById("typeFilter").value
  const owner = document.getElementById("ownerFilter").value
  const filtered = certificates.filter(
    ([name, certOwner, certType, , , , certStatus]) =>
      name.toLowerCase().includes(query) &&
      (!status || certStatus === status) &&
      (!type || certType === type) &&
      (!owner || certOwner === owner),
  )

  rows.innerHTML = filtered
    .map(([name, certOwner, certType, authority, expiry, days, certStatus]) => {
      const statusClass = certStatus === "Active" ? "active" : certStatus === "Expired" ? "expired" : "expiring"
      const dayClass = certStatus === "Expired" ? "danger" : certStatus === "Expiring soon" ? "warning" : ""
      return `<tr>
        <td><input type="checkbox" aria-label="Select ${name}" /></td>
        <td class="certificate-name"><strong>${name}</strong><small>RSA 2048 · SHA-256</small></td>
        <td>${certOwner}</td><td>${certType}</td><td>${authority}</td>
        <td class="expiry"><strong>${expiry}</strong><small class="${dayClass}">${days}</small></td>
        <td><span class="status ${statusClass}">${certStatus}</span></td>
      </tr>`
    })
    .join("")

  document.getElementById("emptyState").style.display = filtered.length === 0 ? "grid" : "none"
  document.getElementById("resultCount").textContent = `Showing ${filtered.length} certificate${filtered.length === 1 ? "" : "s"}`
}

if (document.getElementById("certificateRows")) {
  ;["certificateSearch", "statusFilter", "typeFilter", "ownerFilter"].forEach((id) => {
    document.getElementById(id).addEventListener("input", renderCertificates)
  })
  document.getElementById("clearFilters").addEventListener("click", () => {
    document.getElementById("certificateSearch").value = ""
    document.getElementById("statusFilter").value = ""
    document.getElementById("typeFilter").value = ""
    document.getElementById("ownerFilter").value = ""
    renderCertificates()
  })
  renderCertificates()
}

document.getElementById("discoveryToggle")?.addEventListener("click", (event) => {
  event.currentTarget.classList.toggle("off")
})

document.getElementById("saveSettings")?.addEventListener("click", () => {
  const toast = document.getElementById("toast")
  toast.classList.add("show")
  window.setTimeout(() => toast.classList.remove("show"), 2200)
})
