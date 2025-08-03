$(document).ready(function() {
    // Hiển thị modal khi nhấn nút "Add New Employee"
    $('.add-employee-button').on('click', function() {
        $('#addEmployeeModal').show();
        $('#employee_name').focus();
    });

    // Đóng modal khi nhấn nút đóng hoặc Cancel
    $('.close, #cancelAdd').on('click', function() {
        $('#addEmployeeModal').hide();
        $('#addEmployeeForm')[0].reset();
        $('#addEmployeeForm').validate().resetForm();
    });

    // Đóng modal khi click ra ngoài modal
    $(window).on('click', function(event) {
        if ($(event.target).is('#addEmployeeModal')) {
            $('#addEmployeeModal').hide();
            $('#addEmployeeForm')[0].reset();
            $('#addEmployeeForm').validate().resetForm();
        }
    });

    // Validate form với jQuery Validate
    $('#addEmployeeForm').validate({
        rules: {
            employee_name: {
                required: true,
                minlength: 3
            },
            employee_email: {
                required: true,
                email: true
            },
            employee_address: {
                required: true
            },
            employee_phone: {
                required: true,
                digits: true,
                minlength: 10,
                maxlength: 11
            }
        },
        messages: {
            employee_name: {
                required: "Vui lòng nhập họ tên",
                minlength: "Họ tên phải có ít nhất 3 ký tự"
            },
            employee_email: {
                required: "Vui lòng nhập email",
                email: "Email không hợp lệ"
            },
            employee_address: {
                required: "Vui lòng nhập địa chỉ"
            },
            employee_phone: {
                required: "Vui lòng nhập số điện thoại",
                digits: "Chỉ nhập số",
                minlength: "Số điện thoại tối thiểu 10 số",
                maxlength: "Số điện thoại tối đa 11 số"
            }
        },
        submitHandler: function(form) {
            // Lấy dữ liệu từ form
            const name = $('#employee_name').val();
            const email = $('#employee_email').val();
            const address = $('#employee_address').val();
            const phone = $('#employee_phone').val();

            addEmployeeToTable(name, email, address, phone);

            $('#addEmployeeModal').hide();
            form.reset();
            alert('Đăng ký thành công nhân viên mới!');
            return false;
        }
    });
});

// Thêm nhân viên vào bảng
function addEmployeeToTable(name, email, address, phone) {
    const newRow = `
        <tr>
            <td><input type="checkbox" class="checkbox"></td>
            <td>${name}</td>
            <td>${email}</td>
            <td>${address}</td>
            <td>${phone}</td>
            <td>
                <button class="edit-employee-button">Edit</button>
                <button class="delete-employee-button">Delete</button>
            </td>
        </tr>
    `;
    $('.table tbody').append(newRow);
}