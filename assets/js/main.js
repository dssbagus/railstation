/* ============ KONFIGURASI TAILWIND CSS ============ */
tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                'primary-purple': '#4B21E6',
                'secondary-purple': '#7C4DFF',
                'success-green': '#16A34A',
                'error-red': '#DC2626',
                'info-blue': '#2563EB',
            },
        }
    }
};

/* ============ GOOGLE APPS SCRIPT DATABASE ============ */
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxW_EjwOlgUbreHKl93cT7OzuRlxe7q69uZBkGgHqtek5zhTvmxmTlMuehcjGuQrM-g/exec";

// === 🔹 FUNGSI GET DATA PELANGGAN ===
async function loadCustomers() {
  try {
    const res = await fetch(`${SCRIPT_URL}?action=getPelanggan`);
    const data = await res.json();
    populateCustomerTable(data);
    buildCustomerLookup(data);
  } catch (err) {
    console.error("Gagal memuat pelanggan:", err);
  }
}

// === 🔹 FUNGSI GET DATA PEMBAYARAN ===
async function loadPayments() {
  try {
    const res = await fetch(`${SCRIPT_URL}?action=getPembayaran`);
    const data = await res.json();
    populatePaymentTable(data);
  } catch (err) {
    console.error("Gagal memuat pembayaran:", err);
  }
}

// === 🔹 BANTUAN UNTUK MENGISI TABEL ===
function populateCustomerTable(data) {
  const tbody = document.getElementById("customer-table-body");
  if (!tbody) return;
  tbody.innerHTML = "";
  let no = 1;
  data.forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="px-3 py-2 text-sm">${no++}</td>
      <td class="px-3 py-2 font-semibold text-primary-purple">${row.ID}</td>
      <td class="px-3 py-2">${row.Nama}</td>
      <td class="px-3 py-2">${row.Alamat}</td>
      <td class="px-3 py-2">${row.NomorHP}</td>
      <td class="px-3 py-2">${row.Paket}</td>
      <td class="px-3 py-2">${row.Tarif}</td>
      <td class="px-3 py-2">${row.TanggalPasang}</td>
      <td class="px-3 py-2">${row.Status}</td>
    `;
    tbody.appendChild(tr);
  });
}

function populatePaymentTable(data) {
  const tbody = document.getElementById("payment-table-body");
  if (!tbody) return;
  tbody.innerHTML = "";
  let no = 1;
  data.forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="px-3 py-2 text-sm">${no++}</td>
      <td class="px-3 py-2 font-semibold text-primary-purple">${row.ID}</td>
      <td class="px-3 py-2">${row.Nama}</td>
      <td class="px-3 py-2">${row.Paket}</td>
      <td class="px-3 py-2">${row.Tarif}</td>
      <td class="px-3 py-2">${row.Diskon}</td>
      <td class="px-3 py-2">${row.Total}</td>
      <td class="px-3 py-2">${row.Status}</td>
      <td class="px-3 py-2">${row.TanggalPembayaran}</td>
      <td class="px-3 py-2">${row["Penggunaan Bulan"]}</td>
      <td class="px-3 py-2">${row.Metode}</td>
    `;
    tbody.appendChild(tr);
  });
}

// === 🔹 TAMBAH PELANGGAN ===
async function addCustomer(newCustomer) {
  try {
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "addPelanggan",
        ...newCustomer
      }),
    });
    const result = await res.json();
    if (result.success) {
      alert("✅ Pelanggan berhasil ditambahkan");
      await loadCustomers();
    } else {
      alert("❌ Gagal menambahkan pelanggan");
    }
  } catch (err) {
    console.error("Gagal menambah pelanggan:", err);
  }
}

// === 🔹 TAMBAH PEMBAYARAN ===
async function addPayment(newPayment) {
  try {
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "addPembayaran",
        ...newPayment
      }),
    });
    const result = await res.json();
    if (result.success) {
      alert("✅ Pembayaran berhasil disimpan");
      await loadPayments();
    } else {
      alert("❌ Gagal menyimpan pembayaran");
    }
  } catch (err) {
    console.error("Gagal menambah pembayaran:", err);
  }
}

// === 🔹 UPDATE PELANGGAN ===
async function updateCustomer(updatedCustomer) {
  try {
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "updatePelanggan",
        ...updatedCustomer
      }),
    });
    const result = await res.json();
    if (result.success) {
      alert("✅ Data pelanggan diperbarui");
      await loadCustomers();
    } else {
      alert("❌ Data tidak ditemukan");
    }
  } catch (err) {
    console.error("Gagal memperbarui pelanggan:", err);
  }
}

// === 🔹 HAPUS PELANGGAN ===
async function deleteCustomer(id) {
  if (!confirm("Yakin ingin menghapus pelanggan ini?")) return;
  try {
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({ action: "deletePelanggan", ID: id }),
    });
    const result = await res.json();
    if (result.success) {
      alert("🗑️ Pelanggan dihapus");
      await loadCustomers();
    } else {
      alert("❌ Gagal menghapus pelanggan");
    }
  } catch (err) {
    console.error("Gagal menghapus pelanggan:", err);
  }
}

// === 🔹 SIMPAN DATA LOOKUP ===
function buildCustomerLookup(data) {
  if (!window.customerLookup) window.customerLookup = {};
  data.forEach(row => {
    window.customerLookup[row.ID] = {
      name: row.Nama,
      package: row.Paket,
      tariff: parseInt(row.Tarif || 0)
    };
  });
}

// === 🔹 AUTO LOAD SAAT PAGE TERBUKA ===
document.addEventListener("DOMContentLoaded", () => {
  loadCustomers();
  loadPayments();
});

// Inisialisasi ikon Lucide
        lucide.createIcons();

        // --- Variabel Global dan Elemen ---
        const navCards = document.querySelectorAll('.nav-card'); 
        const headerNavLinks = document.querySelectorAll('.header-nav-link');
        const pageTitle = document.getElementById('page-title');
        const pageContents = document.querySelectorAll('.page-content');
        
        const customerTableBody = document.getElementById('customer-table-body');
        const paymentTableBody = document.getElementById('payment-table-body');
        const unpaidTableBody = document.getElementById('unpaid-table-body');
        const incomeTableBody = document.getElementById('income-table-body');
        const incomeYearFilter = document.getElementById('income-year-filter');
        const applyIncomeFilterBtn = document.getElementById('apply-income-filter-btn');
        const expenseTableBody = document.getElementById('expense-table-body');
        const expenseTotal = document.getElementById('expense-total');
        const editToggleBtn = document.getElementById('edit-toggle-btn');
        const cancelBtn = document.getElementById('cancel-btn');
        const addCustomerContainer = document.getElementById('add-customer-btn-container');
        const addCustomerBtn = document.getElementById('add-customer-btn');

        // Elemen Filter Pembayaran
        const paidMonthFilter = document.getElementById('paid-month-filter');
        const paidYearFilter = document.getElementById('paid-year-filter');
        const applyPaidFilterBtn = document.getElementById('apply-paid-filter-btn');
        const unpaidMonthFilter = document.getElementById('unpaid-month-filter');
        const unpaidYearFilter = document.getElementById('unpaid-year-filter');
        const applyUnpaidFilterBtn = document.getElementById('apply-unpaid-filter-btn');

        // Elemen Modal Pembayaran
        const paymentModal = document.getElementById('payment-form-modal');
        const openPaymentModalBtn = document.getElementById('open-payment-modal-btn');
        const closePaymentModalBtn = document.getElementById('close-payment-modal-btn');
        const formCancelBtn = document.getElementById('form-cancel-btn');
        const paymentForm = document.getElementById('payment-form');
        
        // Elemen Input Form Pembayaran
        const inputIdPelanggan = document.getElementById('id_pelanggan');
        const inputNama = document.getElementById('nama');
        const inputPaket = document.getElementById('paket');
        const inputTarif = document.getElementById('tarif');
        const inputRawTarif = document.getElementById('raw_tarif');
        const inputDiskon = document.getElementById('diskon');
        const inputTotalTarif = document.getElementById('total_tarif');
        const inputRawTotalTarif = document.getElementById('raw_total_tarif');
        const inputTglPembayaran = document.getElementById('tgl_pembayaran');
        const inputBulanPenggunaan = document.getElementById('penggunaan_bulan');
        const lookupMessage = document.getElementById('lookup-message');

        // Elemen Pengeluaran
        const addExpenseBtn = document.getElementById('add-expense-btn');
        const saveExpenseBtn = document.getElementById('save-expense-btn');
        const cancelExpenseBtn = document.getElementById('cancel-expense-btn');
        const expenseActionHeader = document.getElementById('expense-action-header');
        const expenseMonthFilter = document.getElementById('expense-month-filter');
        const expenseYearFilter = document.getElementById('expense-year-filter');
        const applyExpenseFilterBtn = document.getElementById('apply-expense-filter-btn');
        
        let isEditing = false;
        let isEditingExpenses = false;
        let initialDataHTML = '';
        let initialExpenseDataHTML = '';
        
        // --- DATA PELANGGAN (Akan diisi dari Database) ---
        const customerLookup = {};
        let nextCustomerId = 1;

        // --- FUNGSI FORMATTING & HELPERS ---
        function formatRupiah(number) {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(number);
        }

        function getTodayISO() {
            const today = new Date();
            return today.toISOString().split('T')[0];
        }

        function deleteExpenseRow(button) {
            button.closest('tr').remove();
            renumberExpenseRows();
            calculateAndDisplayExpenses();
        }


        // --- FUNGSI FILTER ---
        function populateFilterDropdowns() {
            const months = [
                { value: '1', name: 'Januari' }, { value: '2', name: 'Februari' }, { value: '3', name: 'Maret' },
                { value: '4', name: 'April' }, { value: '5', name: 'Mei' }, { value: '6', name: 'Juni' },
                { value: '7', name: 'Juli' }, { value: '8', name: 'Agustus' }, { value: '9', name: 'September' },
                { value: '10', name: 'Oktober' }, { value: '11', name: 'November' }, { value: '12', name: 'Desember' }
            ];
            const currentYear = new Date().getFullYear();
            const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

            const monthFilters = [paidMonthFilter, unpaidMonthFilter, expenseMonthFilter];
            const yearFilters = [paidYearFilter, unpaidYearFilter, incomeYearFilter, expenseYearFilter];

            monthFilters.forEach(select => {
                select.innerHTML = '<option value="">Semua Bulan</option>';
                months.forEach(month => {
                    select.innerHTML += `<option value="${month.value}">${month.name}</option>`;
                });
            });

            yearFilters.forEach(select => {
                select.innerHTML = '<option value="">Semua Tahun</option>';
                years.forEach(year => {
                    select.innerHTML += `<option value="${year}">${year}</option>`;
                });
            });
        }
        
        function applyPaidTableFilter() {
            const selectedMonth = paidMonthFilter.value;
            const selectedYear = paidYearFilter.value;
            const monthMap = { 'Jan': '1', 'Feb': '2', 'Mar': '3', 'Apr': '4', 'Mei': '5', 'Jun': '6', 'Jul': '7', 'Agt': '8', 'Sep': '9', 'Okt': '10', 'Nov': '11', 'Des': '12' };
            
            paymentTableBody.querySelectorAll('tr').forEach(row => {
                const usageCellText = row.cells[9].textContent.trim(); // "Okt 2024"
                const [monthStr, yearStr] = usageCellText.split(' ');
                
                const month = monthMap[monthStr];
                const year = yearStr;

                const monthMatch = !selectedMonth || month === selectedMonth;
                const yearMatch = !selectedYear || year === selectedYear;

                if (monthMatch && yearMatch) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        }
        
        function applyExpenseTableFilter() {
            const selectedMonth = expenseMonthFilter.value;
            const selectedYear = expenseYearFilter.value;

            expenseTableBody.querySelectorAll('tr').forEach(row => {
                const dateCell = row.cells[1];
                let dateText;

                if (isEditingExpenses) {
                     const dateValue = dateCell.querySelector('input[type="date"]').value;
                    const parts = dateValue.split('-'); // YYYY-MM-DD
                    dateText = `${parts[2]}/${parts[1]}/${parts[0]}`;
                } else {
                    dateText = dateCell.textContent.trim();
                }

                if (!dateText) {
                    row.style.display = ''; // Show new, empty rows
                    return;
                }

                const dateParts = dateText.split('/'); // DD/MM/YYYY
                const month = dateParts[1];
                const year = dateParts[2];
                
                const monthMatch = !selectedMonth || parseInt(month) === parseInt(selectedMonth);
                const yearMatch = !selectedYear || year === selectedYear;

                if (monthMatch && yearMatch) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        }


        function applyUnpaidTableFilter() {
             const selectedMonth = unpaidMonthFilter.value || (new Date().getMonth() + 1).toString();
             const selectedYear = unpaidYearFilter.value || new Date().getFullYear().toString();
             populateUnpaidTable(selectedMonth, selectedYear);
        }


        // --- FUNGSI PELANGGAN BARU ---
        function addNewCustomerRow() {
            const tableBody = document.getElementById('customer-table-body');
            const newRow = tableBody.insertRow();
            const newRowCount = tableBody.rows.length;

            const newId = `MJ-${String(nextCustomerId).padStart(3, '0')}`;
            nextCustomerId++;

            const today = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });

            newRow.className = 'hover:bg-gray-50';
            newRow.innerHTML = `
                <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500">${newRowCount}</td>
                <td class="px-3 py-4 whitespace-nowrap font-semibold text-primary-purple">${newId}</td>
                <td contenteditable="true" class="px-3 py-4 whitespace-nowrap bg-indigo-50 outline-indigo-200 p-2"></td>
                <td contenteditable="true" class="px-3 py-4 whitespace-nowrap text-sm bg-indigo-50 outline-indigo-200 p-2"></td>
                <td contenteditable="true" class="px-3 py-4 whitespace-nowrap text-sm bg-indigo-50 outline-indigo-200 p-2"></td>
                <td contenteditable="true" class="px-3 py-4 whitespace-nowrap text-sm bg-indigo-50 outline-indigo-200 p-2"></td>
                <td contenteditable="true" class="px-3 py-4 whitespace-nowrap text-sm font-medium bg-indigo-50 outline-indigo-200 p-2"></td>
                <td contenteditable="true" class="px-3 py-4 whitespace-nowrap text-sm bg-indigo-50 outline-indigo-200 p-2">${today}</td>
                <td class="px-3 py-4 whitespace-nowrap">
                    <select class="w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm">
                        <option value="Aktif" selected>Aktif</option>
                        <option value="Nonaktif">Nonaktif</option>
                    </select>
                </td>
            `;

            newRow.cells[2].focus();
        }


        // --- FUNGSI PEMBAYARAN ---
        function lookupCustomerData() {
            const id = inputIdPelanggan.value.toUpperCase().trim();
            const data = customerLookup[id];
            
            inputNama.value = '';
            inputPaket.value = '';
            inputTarif.value = '';
            inputRawTarif.value = '0';
            lookupMessage.textContent = '';
            
            if (data) {
                inputNama.value = data.name;
                inputPaket.value = data.package;
                inputRawTarif.value = data.tariff;
                inputTarif.value = formatRupiah(data.tariff);
                lookupMessage.textContent = 'Data ditemukan.';
                lookupMessage.classList.remove('text-red-500');
                lookupMessage.classList.add('text-green-600');
            } else if (id.length > 0) {
                lookupMessage.textContent = 'ID Pelanggan tidak ditemukan.';
                lookupMessage.classList.remove('text-green-600');
                lookupMessage.classList.add('text-red-500');
            } else {
                 lookupMessage.textContent = '';
            }

            calculateTotalTarif();
        }

        function calculateTotalTarif() {
            const tarif = parseInt(inputRawTarif.value) || 0;
            const diskon = parseInt(inputDiskon.value) || 0;
            let total = tarif - diskon;
            if (total < 0) total = 0;

            inputRawTotalTarif.value = total;
            inputTotalTarif.value = formatRupiah(total);
        }

        function addPaymentRow(data) {
            const newRow = paymentTableBody.insertRow();
            newRow.className = 'hover:bg-gray-50';
            const statusClass = 'bg-green-100 text-green-800';
            const statusText = 'Lunas';
            const currentNo = paymentTableBody.rows.length;

            newRow.innerHTML = `
                <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500">${currentNo}</td>
                <td class="px-3 py-4 whitespace-nowrap font-semibold text-primary-purple">${data.idPelanggan}</td>
                <td class="px-3 py-4 whitespace-nowrap">${data.nama}</td>
                <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-800">${data.paket}</td>
                <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-900">${formatRupiah(data.tarif)}</td>
                <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-600">${formatRupiah(data.diskon)}</td>
                <td class="px-3 py-4 whitespace-nowrap text-sm font-bold text-green-700">${formatRupiah(data.totalTarif)}</td>
                <td class="px-3 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">${statusText}</span>
                </td>
                <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500">${data.tglPembayaran}</td>
                <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500">${data.bulanPenggunaan}</td>
                <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500">${data.metode}</td>
            `;
            
            updateRowStyles();
        }

        function handlePaymentSubmit(e) {
            e.preventDefault();
            const data = {
                idPelanggan: inputIdPelanggan.value.toUpperCase().trim(),
                nama: inputNama.value,
                paket: inputPaket.value,
                tarif: parseInt(inputRawTarif.value) || 0,
                diskon: parseInt(inputDiskon.value) || 0,
                totalTarif: parseInt(inputRawTotalTarif.value) || 0,
                tglPembayaran: new Date(inputTglPembayaran.value).toLocaleDateString('id-ID'),
                bulanPenggunaan: new Date(inputBulanPenggunaan.value).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }).replace('.', ''),
                metode: document.getElementById('metode').value,
            };

            if (!data.nama) {
                lookupMessage.textContent = 'Data pelanggan belum valid. Silakan cari ID pelanggan yang benar.';
                lookupMessage.classList.add('text-red-500');
                return;
            }
            addPaymentRow(data);
            populateUnpaidTable();
            closePaymentFormModal();
            updateFinancialSummary(); 
        }

        function openPaymentFormModal() {
            paymentModal.classList.remove('hidden');
            inputTglPembayaran.value = getTodayISO();
            paymentForm.reset();
            lookupCustomerData(); 
            calculateTotalTarif(); 
        }

        function closePaymentFormModal() {
            paymentModal.classList.add('hidden');
            paymentForm.reset();
            lookupMessage.textContent = '';
        }

        // --- FUNGSI KEUANGAN (PEMBUKUAN) ---

        function renumberExpenseRows() {
            if (!expenseTableBody) return;
            expenseTableBody.querySelectorAll('tr').forEach((row, index) => {
                row.cells[0].textContent = index + 1;
            });
        }

        function toggleExpenseEditMode(isEditing) {
            isEditingExpenses = isEditing;
            const tfoot = expenseTableBody.nextElementSibling; 

            if (isEditing) {
                initialExpenseDataHTML = expenseTableBody.innerHTML;
                addExpenseBtn.classList.add('hidden');
                saveExpenseBtn.classList.remove('hidden');
                cancelExpenseBtn.classList.remove('hidden');
                expenseActionHeader.classList.remove('hidden');
                if(tfoot) tfoot.querySelector('th').colSpan = "7";

                expenseTableBody.querySelectorAll('tr').forEach(row => {
                    const dateText = row.cells[1].textContent.trim();
                    const parts = dateText.split('/');
                    const dateValue = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
                    row.cells[1].innerHTML = `<input type="date" value="${dateValue}" class="w-full bg-indigo-50 outline-indigo-200 border-none p-1 rounded text-sm">`;
                    
                    row.cells[2].setAttribute('contenteditable', 'true');
                    row.cells[3].setAttribute('contenteditable', 'true');
                    row.cells[4].setAttribute('contenteditable', 'true');
                    row.cells[2].classList.add('bg-indigo-50', 'outline-indigo-200');
                    row.cells[3].classList.add('bg-indigo-50', 'outline-indigo-200');
                    row.cells[4].classList.add('bg-indigo-50', 'outline-indigo-200');

                    if (row.cells.length < 7) {
                        const actionCell = row.insertCell(-1);
                        actionCell.classList.add('px-3', 'py-4', 'whitespace-nowrap', 'text-center');
                        actionCell.innerHTML = `<button onclick="deleteExpenseRow(this)" class="p-1 rounded-full hover:bg-red-100">
                                                    <svg class="lucide lucide-trash-2 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                                </button>`;
                    }
                });

            } else { 
                addExpenseBtn.classList.remove('hidden');
                saveExpenseBtn.classList.add('hidden');
                cancelExpenseBtn.classList.add('hidden');
                expenseActionHeader.classList.add('hidden');
                if(tfoot) tfoot.querySelector('th').colSpan = "6";
                
                expenseTableBody.querySelectorAll('tr').forEach(row => {
                    const dateInput = row.cells[1].querySelector('input[type="date"]');
                    if(dateInput) {
                        const dateValue = dateInput.value;
                        const parts = dateValue.split('-');
                        row.cells[1].textContent = `${parts[2]}/${parts[1]}/${parts[0]}`;
                    }
                    
                    row.cells[2].setAttribute('contenteditable', 'false');
                    row.cells[3].setAttribute('contenteditable', 'false');
                    row.cells[4].setAttribute('contenteditable', 'false');
                    row.cells[2].classList.remove('bg-indigo-50', 'outline-indigo-200');
                    row.cells[3].classList.remove('bg-indigo-50', 'outline-indigo-200');
                    row.cells[4].classList.remove('bg-indigo-50', 'outline-indigo-200');
                    
                     if (row.cells.length > 6) {
                        row.deleteCell(-1);
                    }
                });
                updateFinancialSummary();
            }
        }

        function addNewExpenseRow() {
            if (!isEditingExpenses) {
                toggleExpenseEditMode(true);
            }
            
            const newRow = expenseTableBody.insertRow();
            const newRowCount = expenseTableBody.rows.length;

            newRow.className = 'hover:bg-gray-50';
            newRow.innerHTML = `
                <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500">${newRowCount}</td>
                <td class="px-3 py-4 whitespace-nowrap text-sm"><input type="date" value="${getTodayISO()}" class="w-full bg-indigo-50 outline-indigo-200 border-none p-1 rounded text-sm"></td>
                <td contenteditable="true" class="px-3 py-4 whitespace-nowrap bg-indigo-50 outline-indigo-200"></td>
                <td contenteditable="true" data-type="qty" class="px-3 py-4 whitespace-nowrap text-sm text-center bg-indigo-50 outline-indigo-200">1</td>
                <td contenteditable="true" data-type="price" class="px-3 py-4 whitespace-nowrap text-sm bg-indigo-50 outline-indigo-200">0</td>
                <td class="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">Rp 0</td>
                <td class="px-3 py-4 whitespace-nowrap text-center">
                    <button onclick="deleteExpenseRow(this)" class="p-1 rounded-full hover:bg-red-100">
                        <svg class="lucide lucide-trash-2 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                    </button>
                </td>
            `;
            newRow.cells[2].focus();
        }

        function calculateAndDisplayExpenses() {
            if (!expenseTableBody || !expenseTotal) return 0;
            let total = 0;
            expenseTableBody.querySelectorAll('tr').forEach(row => {
                if (row.style.display !== 'none') {
                    const qtyCell = row.cells[3];
                    const priceCell = row.cells[4];
                    const subtotalCell = row.cells[5];

                    const qty = parseInt(qtyCell.textContent) || 0;
                    const price = parseInt(priceCell.textContent.replace(/[^0-9]/g, '')) || 0;
                    const subtotal = qty * price;

                    subtotalCell.textContent = formatRupiah(subtotal);
                    total += subtotal;
                }
            });
            expenseTotal.textContent = formatRupiah(total);
            return total;
        }

        function calculateAndDisplayIncome() {
            if (!incomeTableBody || !paymentTableBody) return 0;

            const selectedYear = incomeYearFilter.value || new Date().getFullYear().toString();
            
            const monthlyIncome = {};
            let totalYearlyIncome = 0;

            paymentTableBody.querySelectorAll('tr').forEach(row => {
                const dateString = row.cells[8].textContent.trim();
                const amountString = row.cells[6].textContent.trim();
                
                if (dateString && amountString) {
                    const dateParts = dateString.split('/'); 
                    if (dateParts.length === 3) {
                        const month = parseInt(dateParts[1], 10);
                        const year = parseInt(dateParts[2], 10);

                        if (year.toString() === selectedYear) {
                            const key = `${year}-${String(month).padStart(2, '0')}`;
                            const amount = parseInt(amountString.replace(/[^0-9]/g, ''), 10);

                            if (!monthlyIncome[key]) {
                                monthlyIncome[key] = 0;
                            }
                            monthlyIncome[key] += amount;
                            totalYearlyIncome += amount;
                        }
                    }
                }
            });

            incomeTableBody.innerHTML = '';
            
            const monthsInYear = Array.from({length: 12}, (_, i) => i + 1);
            let hasIncomeInYear = false;

            monthsInYear.forEach(monthNum => {
                const key = `${selectedYear}-${String(monthNum).padStart(2, '0')}`;
                const dateObj = new Date(selectedYear, monthNum - 1);
                const monthName = dateObj.toLocaleString('id-ID', { month: 'long' });
                const income = monthlyIncome[key] || 0;
                
                if (income > 0) hasIncomeInYear = true;

                const newRow = incomeTableBody.insertRow();
                newRow.innerHTML = `
                    <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-800">${monthName}</td>
                    <td class="px-3 py-4 whitespace-nowrap text-sm font-medium ${income > 0 ? 'text-green-700' : 'text-gray-500'} text-right">${formatRupiah(income)}</td>
                `;
            });
            
            const totalCell = document.getElementById('income-total');
            if(totalCell) {
                totalCell.textContent = formatRupiah(totalYearlyIncome);
                totalCell.parentElement.querySelector('th').textContent = `Total Pemasukan ${selectedYear}`;
            }

            if (!hasIncomeInYear) {
                 incomeTableBody.innerHTML = `<tr><td colspan="2" class="px-3 py-4 text-center text-gray-500">Tidak ada data pemasukan untuk tahun ${selectedYear}.</td></tr>`;
            }

            return totalYearlyIncome;
        }

        function updateFinancialSummary() {
            const totalIncome = calculateAndDisplayIncome();
            applyExpenseTableFilter();
            const totalExpense = calculateAndDisplayExpenses();
            
            const prevYearBalanceEl = document.getElementById('prev-year-balance');
            const currentYearIncomeEl = document.getElementById('current-year-income');
            const currentYearExpenseEl = document.getElementById('current-year-expense');
            const finalBalanceEl = document.getElementById('final-balance');

            const prevYearBalance = 0; // Data ini bisa diambil dari rekap tahun lalu
            
            const finalBalance = prevYearBalance + totalIncome - totalExpense;

            prevYearBalanceEl.textContent = formatRupiah(prevYearBalance);
            currentYearIncomeEl.textContent = formatRupiah(totalIncome);
            currentYearExpenseEl.textContent = formatRupiah(totalExpense);
            finalBalanceEl.textContent = formatRupiah(finalBalance);
        }


        function populateUnpaidTable(filterMonth, filterYear) {
            if (!unpaidTableBody) return;

            const targetDate = new Date();
            const targetMonth = filterMonth || (targetDate.getMonth() + 1).toString();
            const targetYear = filterYear || targetDate.getFullYear().toString();
            
            const targetPeriodString = new Date(targetYear, targetMonth - 1).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }).replace('.', '');

            const paidCustomerForPeriod = new Set();
            paymentTableBody.querySelectorAll('tr').forEach(row => {
                const usagePeriod = row.cells[9].textContent.trim();
                if (usagePeriod === targetPeriodString) {
                    const idCell = row.cells[1];
                    if (idCell) paidCustomerForPeriod.add(idCell.textContent.trim());
                }
            });

            const allCustomerIds = Object.keys(customerLookup);
            const unpaidCustomers = allCustomerIds.filter(id => !paidCustomerForPeriod.has(id));

            unpaidTableBody.innerHTML = '';
            let unpaidCounter = 1;

            unpaidCustomers.forEach(id => {
                const customerData = customerLookup[id];
                if (customerData) {
                    const newRow = unpaidTableBody.insertRow();
                    newRow.className = 'hover:bg-gray-50';
                    newRow.innerHTML = `
                        <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500">${unpaidCounter++}</td>
                        <td class="px-3 py-4 whitespace-nowrap font-semibold text-primary-purple">${id}</td>
                        <td class="px-3 py-4 whitespace-nowrap">${customerData.name}</td>
                        <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-800">${customerData.package}</td>
                        <td class="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${formatRupiah(customerData.tariff)}</td>
                        <td class="px-3 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">${targetPeriodString}</td>
                    `;
                }
            });
        }
        
        // --- FUNGSI UMUM ---
        function updateRowStyles() {
            customerTableBody.querySelectorAll('tr').forEach(row => {
                const statusSpan = row.cells[row.cells.length - 1]?.querySelector('span');
                if (statusSpan?.textContent.trim() === 'Nonaktif') {
                    row.classList.add('bg-red-50');
                } else {
                    row.classList.remove('bg-red-50');
                }
            });
            paymentTableBody.querySelectorAll('tr').forEach(row => row.classList.remove('bg-red-50'));
        }
        
        function switchToPage(targetPage) {
            pageContents.forEach(content => content.classList.add('hidden'));
            document.getElementById(targetPage)?.classList.remove('hidden');
            
            headerNavLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-target-page') === targetPage) {
                    link.classList.add('active');
                }
            });

            const titleMap = {
                'dashboard': 'Dashboard Utama',
                'customers': 'Data Pelanggan',
                'payments': 'Lacak Pembayaran Pelanggan',
                'finance': 'Detail Pembukuan Keuangan',
            };
            pageTitle.textContent = titleMap[targetPage] || 'Halaman';
            
            if (targetPage === 'payments') {
                populateUnpaidTable();
                applyPaidTableFilter();
            }
            if (targetPage === 'finance') {
                updateFinancialSummary();
            }
            updateRowStyles();
        }

        function toggleEditingMode(newState) {
            isEditing = typeof newState === 'boolean' ? newState : !isEditing;
            const rows = customerTableBody.querySelectorAll('tr');

            if (isEditing) {
                initialDataHTML = customerTableBody.innerHTML;
                rows.forEach(row => {
                    row.querySelectorAll('td').forEach((cell, index) => {
                        if (index >= 2 && index <= 7) { 
                            cell.setAttribute('contenteditable', 'true');
                            cell.classList.add('bg-indigo-50', 'outline-indigo-200', 'p-2');
                        }
                        if (index === 8) {
                            const statusSpan = cell.querySelector('span');
                            if (statusSpan) {
                                const currentStatus = statusSpan.textContent.trim();
                                cell.innerHTML = `
                                    <select class="w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm">
                                        <option value="Aktif" ${currentStatus === 'Aktif' ? 'selected' : ''}>Aktif</option>
                                        <option value="Nonaktif" ${currentStatus === 'Nonaktif' ? 'selected' : ''}>Nonaktif</option>
                                    </select>
                                `;
                            }
                        }
                    });
                });
                editToggleBtn.textContent = 'Simpan';
                editToggleBtn.classList.replace('bg-primary-purple', 'bg-green-600');
                editToggleBtn.classList.replace('hover:bg-secondary-purple', 'hover:bg-green-700');
                cancelBtn.classList.remove('hidden');
                addCustomerContainer.classList.remove('hidden');
            } else {
                rows.forEach(row => {
                    const cells = row.cells;
                    const id = cells[1].textContent.trim();
                    const name = cells[2].textContent.trim();
                    const pkg = cells[5].textContent.trim();
                    const tariffValue = parseInt(cells[6].textContent.replace(/[^0-9]/g, '')) || 0;

                    customerLookup[id] = { name, package: pkg, tariff: tariffValue };
                    cells[6].textContent = formatRupiah(tariffValue);

                    row.querySelectorAll('td').forEach((cell, index) => {
                        cell.setAttribute('contenteditable', 'false');
                        cell.classList.remove('bg-indigo-50', 'outline-indigo-200', 'p-2');
                        if (index === 8) {
                            const select = cell.querySelector('select');
                            if (select) {
                                const selectedStatus = select.value;
                                let statusClass = selectedStatus === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
                                cell.innerHTML = `<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">${selectedStatus}</span>`;
                            }
                        }
                    });
                });
                updateRowStyles();
                editToggleBtn.textContent = 'Edit';
                editToggleBtn.classList.replace('bg-green-600', 'bg-primary-purple');
                editToggleBtn.classList.replace('hover:bg-green-700', 'hover:bg-secondary-purple');
                cancelBtn.classList.add('hidden');
                addCustomerContainer.classList.add('hidden');
            }
        }

        // --- EVENT LISTENERS ---
        [...navCards, ...headerNavLinks].forEach(element => {
            element.addEventListener('click', function(e) {
                e.preventDefault();
                if(isEditing) toggleEditingMode(false);
                if(isEditingExpenses) toggleExpenseEditMode(false);
                switchToPage(this.getAttribute('data-target-page'));
            });
        });

        if (editToggleBtn) {
            editToggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                toggleEditingMode();
            });
        }
        if (cancelBtn) {
            cancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                customerTableBody.innerHTML = initialDataHTML;
                toggleEditingMode(false); 
            });
        }
        if (addCustomerBtn) {
            addCustomerBtn.addEventListener('click', (e) => {
                e.preventDefault();
                addNewCustomerRow();
            });
        }
        
        openPaymentModalBtn.addEventListener('click', openPaymentFormModal);
        closePaymentModalBtn.addEventListener('click', closePaymentFormModal);
        formCancelBtn.addEventListener('click', closePaymentFormModal);
        inputIdPelanggan.addEventListener('input', lookupCustomerData);
        inputDiskon.addEventListener('input', calculateTotalTarif);
        paymentForm.addEventListener('submit', handlePaymentSubmit);

        // Event Listeners untuk Filter
        applyPaidFilterBtn.addEventListener('click', applyPaidTableFilter);
        applyUnpaidFilterBtn.addEventListener('click', applyUnpaidTableFilter);
        applyExpenseFilterBtn.addEventListener('click', updateFinancialSummary);

        if (applyIncomeFilterBtn) {
            applyIncomeFilterBtn.addEventListener('click', updateFinancialSummary);
        }

        // Event listener untuk tabel pengeluaran
        if (expenseTableBody) {
            expenseTableBody.addEventListener('input', calculateAndDisplayExpenses);
        }
        if (addExpenseBtn) {
            addExpenseBtn.addEventListener('click', addNewExpenseRow);
        }
        if (saveExpenseBtn) {
            saveExpenseBtn.addEventListener('click', () => {
                toggleExpenseEditMode(false);
            });
        }
        if (cancelExpenseBtn) {
            cancelExpenseBtn.addEventListener('click', () => {
                expenseTableBody.innerHTML = initialExpenseDataHTML;
                toggleExpenseEditMode(false);
            });
        }


        // --- INITIALIZATION ---
        document.addEventListener('DOMContentLoaded', () => {
            populateFilterDropdowns();
            updateRowStyles();
            initialDataHTML = customerTableBody.innerHTML;
            initialExpenseDataHTML = expenseTableBody.innerHTML;
            populateUnpaidTable();
            updateFinancialSummary();
            renumberExpenseRows();
            switchToPage('dashboard');
        });