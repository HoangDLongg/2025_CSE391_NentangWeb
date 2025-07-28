document.addEventListener('DOMContentLoaded', function() {
    const studentForm = document.getElementById('studentForm');
    const editModal = document.getElementById('editModal');
    const editForm = document.getElementById('editStudentForm');
    const closeModal = document.querySelector('.close');
    const cancelEdit = document.getElementById('cancelEdit');
    
    // Biến global để lưu hàng đang sửa
    window.currentEditRow = null;
    
    // Form chính - đăng ký sinh viên mới
    studentForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        
        const name = document.getElementById('ho_ten').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('so_dien_thoai').value;
        const dob = document.getElementById('ngay_sinh').value;
        const gender = document.getElementById('gioi_tinh').value;
        const course = document.getElementById('khoa_hoc').value;
        const address = document.getElementById('dia_chi').value;
        
        // Validation chi tiết
        const validationResult = validateForm(name, email, phone, dob, gender, course, address);
        if (!validationResult.isValid) {
            alert(validationResult.message);
            return;
        }
        
        addStudentToTable(name, email, phone, dob, gender, course, address);
    });

    // Form sửa sinh viên
    editForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        console.log('Form sửa được submit');
        console.log('currentEditRow:', window.currentEditRow);
        
        const name = document.getElementById('edit_ho_ten').value;
        const email = document.getElementById('edit_email').value;
        const phone = document.getElementById('edit_so_dien_thoai').value;
        const dob = document.getElementById('edit_ngay_sinh').value;
        const gender = document.getElementById('edit_gioi_tinh').value;
        const course = document.getElementById('edit_khoa_hoc').value;
        const address = document.getElementById('edit_dia_chi').value;
        
        console.log('Dữ liệu mới:', {name, email, phone, dob, gender, course, address});
        
        // Validation
        const validationResult = validateForm(name, email, phone, dob, gender, course, address);
        if (!validationResult.isValid) {
            alert(validationResult.message);
            return;
        }
        
        // Kiểm tra currentEditRow có tồn tại không
        if (!window.currentEditRow) {
            alert('Lỗi: Không tìm thấy hàng cần sửa!');
            return;
        }
        
        // Cập nhật dữ liệu trong hàng
        const cells = window.currentEditRow.getElementsByTagName('td');
        cells[0].textContent = name;
        cells[1].textContent = email;
        cells[2].textContent = dob;
        cells[3].textContent = gender;
        cells[4].textContent = course;
        cells[5].textContent = phone;
        cells[6].textContent = address;
        
        console.log('Đã cập nhật cells');
        
        // Đóng modal
        editModal.style.display = 'none';
        alert('Đã cập nhật thông tin sinh viên thành công!');
    });

    // Đóng modal
    closeModal.addEventListener('click', function() {
        editModal.style.display = 'none';
    });

    cancelEdit.addEventListener('click', function() {
        editModal.style.display = 'none';
    });

    // Đóng modal khi click bên ngoài
    window.addEventListener('click', function(event) {
        if (event.target === editModal) {
            editModal.style.display = 'none';
        }
    });
});

function validateForm(name, email, phone, dob, gender, course, address) {
    if (!name || !email || !phone || !dob || !gender || !course || !address) {
        return {
            isValid: false,
            message: 'Vui lòng điền đầy đủ thông tin.'
        };
    }
    
    if (name.length < 2 || name.length > 50) {
        return {
            isValid: false,
            message: 'Họ tên phải từ 2-50 ký tự.'
        };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return {
            isValid: false,
            message: 'Email không đúng định dạng.'
        };
    }
    
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phone)) {
        return {
            isValid: false,
            message: 'Số điện thoại phải có 10-11 chữ số.'
        };
    }
    
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    if (age < 16 || age > 60) {
        return {
            isValid: false,
            message: 'Tuổi phải từ 16-60.'
        };
    }
    
    if (birthDate > today) {
        return {
            isValid: false,
            message: 'Ngày sinh không thể trong tương lai.'
        };
    }
    
    if (address.length < 10 || address.length > 200) {
        return {
            isValid: false,
            message: 'Địa chỉ phải từ 10-200 ký tự.'
        };
    }
    
    return {
        isValid: true,
        message: 'Validation thành công'
    };
}

function addStudentToTable(name, email, phone, dob, gender, course, address) {
    const tableBody = document.getElementById('studentTableBody');
    const newRow = document.createElement('tr');
    
    newRow.innerHTML = `
        <td>${name}</td>
        <td>${email}</td>
        <td>${dob}</td>
        <td>${gender}</td>
        <td>${course}</td>
        <td>${phone}</td>
        <td>${address}</td>
        <td>
            <button class="btn btn-danger" onclick="deleteStudent(this)">
                 Xóa
            </button>
            <button class="btn btn-danger" onclick="editStudent(this)">
                 Sửa
            </button>
        </td>
    `;
    
    tableBody.appendChild(newRow);
    document.getElementById('studentForm').reset();
    alert('Đã thêm sinh viên thành công!');
}

function deleteStudent(button) {
    if (confirm('Bạn có chắc muốn xóa sinh viên này?')) {
        const row = button.closest('tr');
        row.remove();
        alert('Đã xóa sinh viên!');
    }
}

function editStudent(button) {
    const row = button.closest('tr');
    const cells = row.getElementsByTagName('td');
    
    // Lưu reference của hàng đang sửa
    window.currentEditRow = row;
    
    // Lấy dữ liệu hiện tại và điền vào form modal
    document.getElementById('edit_ho_ten').value = cells[0].textContent;
    document.getElementById('edit_email').value = cells[1].textContent;
    document.getElementById('edit_ngay_sinh').value = cells[2].textContent;
    document.getElementById('edit_gioi_tinh').value = cells[3].textContent;
    document.getElementById('edit_khoa_hoc').value = cells[4].textContent;
    document.getElementById('edit_so_dien_thoai').value = cells[5].textContent;
    document.getElementById('edit_dia_chi').value = cells[6].textContent;
    
    // Hiển thị modal
    document.getElementById('editModal').style.display = 'block';
    
    // Focus vào trường đầu tiên
    setTimeout(() => {
        document.getElementById('edit_ho_ten').focus();
    }, 100);
}
