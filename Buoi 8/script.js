document.addEventListener('DOMContentLoaded', function() {
    // Lấy các phần tử DOM
    const addButton = document.querySelector('.add-button');
    const modal = document.getElementById('Addhoadon');
    const closeBtn = document.querySelector('.close');
    const cancelBtn = document.getElementById('cancelAdd');
    const addForm = document.getElementById('themhoadon');
    const tableBody = document.querySelector('tbody');

    // Biến để tạo ID tự động
    let nextId = 1680;

    // Mở modal khi nhấn nút THÊM
    addButton.addEventListener('click', function() {
        modal.style.display = 'block';
        // Focus vào trường đầu tiên
        setTimeout(() => {
            document.getElementById('khachhang').focus();
        }, 100);
    });

    // Đóng modal khi nhấn nút X
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        addForm.reset();
    });

    // Đóng modal khi nhấn nút Hủy
    cancelBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        addForm.reset();
    });

    // Đóng modal khi click bên ngoài
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            addForm.reset();
        }
    });

    // Xử lý submit form
    addForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const khachHang = document.getElementById('khachhang').value.trim();
        const nhanVien = document.getElementById('nhanvien').value.trim();
        const soTien = document.getElementById('sotien').value.trim();

        // Validation
        if (!khachHang || !nhanVien || !soTien) {
            alert('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        // Kiểm tra số tiền có phải là số không
        const soTienNumber = parseFloat(soTien.replace(/[.,]/g, ''));
        if (isNaN(soTienNumber) || soTienNumber <= 0) {
            alert('Vui lòng nhập số tiền hợp lệ!');
            return;
        }

        // Thêm giao dịch mới vào bảng
        addTransactionToTable(khachHang, nhanVien, soTienNumber);
        
        // Đóng modal và reset form
        modal.style.display = 'none';
        addForm.reset();
        
        alert('Đã thêm giao dịch thành công!');
    });

    // Function thêm giao dịch vào bảng
    function addTransactionToTable(khachHang, nhanVien, soTien) {
        const newRow = document.createElement('tr');
        
        // Tạo ngày giờ hiện tại
        const now = new Date();
        const ngayMua = formatDate(now);
        
        // Format số tiền
        const soTienFormatted = formatMoney(soTien);
        
        newRow.innerHTML = `
            <td class="checkbox-cell">
                <input type="checkbox">
            </td>
            <td>
                <div class="actions-cell">
                    <button class="action-btn view-btn" title="Xem">👁</button>
                    <button class="action-btn edit-btn" title="Sửa">✏</button>
                    <button class="action-btn delete-btn" title="Xóa" onclick="deleteRow(this)">🗑</button>
                </div>
            </td>
            <td>${nextId}</td>
            <td>${khachHang}</td>
            <td>${nhanVien}</td>
            <td class="money">${soTienFormatted}</td>
            <td>${ngayMua}</td>
        `;
        
        // Thêm animation khi thêm row mới
        newRow.style.opacity = '0';
        newRow.style.transform = 'translateY(-20px)';
        
        tableBody.appendChild(newRow);
        
        // Animation fade in
        setTimeout(() => {
            newRow.style.transition = 'all 0.5s ease';
            newRow.style.opacity = '1';
            newRow.style.transform = 'translateY(0)';
        }, 100);
        
        nextId++;
    }

    // Function format ngày tháng
    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        const monthNames = [
            'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
            'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
        ];
        
        return `${day} ${monthNames[date.getMonth()]} ${year} ${hours}:${minutes}`;
    }

    // Function format số tiền
    function formatMoney(amount) {
        return new Intl.NumberFormat('vi-VN').format(amount);
    }

    // Function xử lý checkbox "Select All"
    const selectAllCheckbox = document.getElementById('selectAll');
    selectAllCheckbox.addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
            const row = checkbox.closest('tr');
            if (this.checked) {
                row.classList.add('selected-row');
            } else {
                row.classList.remove('selected-row');
            }
        });
    });

    // Function xử lý checkbox của từng hàng
    document.addEventListener('change', function(event) {
        if (event.target.type === 'checkbox' && event.target !== selectAllCheckbox) {
            const row = event.target.closest('tr');
            if (event.target.checked) {
                row.classList.add('selected-row');
            } else {
                row.classList.remove('selected-row');
            }
            
            // Cập nhật trạng thái select all
            const allCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]');
            const checkedCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]:checked');
            selectAllCheckbox.checked = allCheckboxes.length === checkedCheckboxes.length;
        }
    });

    // Function xử lý nút "Delete Selected"
    const deleteSelectedBtn = document.querySelector('.delete-selected');
    deleteSelectedBtn.addEventListener('click', function() {
        const selectedCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]:checked');
        
        if (selectedCheckboxes.length === 0) {
            alert('Vui lòng chọn ít nhất một bản ghi để xóa!');
            return;
        }
        
        if (confirm(`Bạn có chắc muốn xóa ${selectedCheckboxes.length} bản ghi đã chọn?`)) {
            selectedCheckboxes.forEach(checkbox => {
                const row = checkbox.closest('tr');
                row.style.transition = 'all 0.3s ease';
                row.style.opacity = '0';
                row.style.transform = 'translateX(-100%)';
                
                setTimeout(() => {
                    row.remove();
                }, 300);
            });
            
            // Reset select all checkbox
            selectAllCheckbox.checked = false;
            
            setTimeout(() => {
                alert('Đã xóa các bản ghi đã chọn!');
            }, 350);
        }
    });
});

// Function xóa từng hàng (được gọi từ nút delete của từng hàng)
function deleteRow(button) {
    if (confirm('Bạn có chắc muốn xóa giao dịch này?')) {
        const row = button.closest('tr');
        row.style.transition = 'all 0.3s ease';
        row.style.opacity = '0';
        row.style.transform = 'translateX(-100%)';
        
        setTimeout(() => {
            row.remove();
            alert('Đã xóa giao dịch!');
        }, 300);
    }
}
