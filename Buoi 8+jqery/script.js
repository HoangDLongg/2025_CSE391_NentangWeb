$(document).ready(function() {
    // Biến để tạo ID tự động
    let nextId = 1680;

    // Khởi tạo jQuery Validate cho form
    $("#themhoadon").validate({
        rules: {
            khachhang: {
                required: true,
                minlength: 2,
                maxlength: 50
            },
            nhanvien: {
                required: true,
                minlength: 2,
                maxlength: 50
            },
            sotien: {
                required: true,
                min: 1000,
                max: 999999999,
                number: true
            }
        },
        messages: {
            khachhang: {
                required: "Vui lòng nhập tên khách hàng",
                minlength: "Tên khách hàng phải có ít nhất 2 ký tự",
                maxlength: "Tên khách hàng không được quá 50 ký tự"
            },
            nhanvien: {
                required: "Vui lòng nhập tên nhân viên",
                minlength: "Tên nhân viên phải có ít nhất 2 ký tự",
                maxlength: "Tên nhân viên không được quá 50 ký tự"
            },
            sotien: {
                required: "Vui lòng nhập số tiền",
                min: "Số tiền phải ít nhất 1.000 VNĐ",
                max: "Số tiền không được quá 999.999.999 VNĐ",
                number: "Vui lòng nhập số hợp lệ"
            }
        },
        errorElement: "div",
        errorClass: "error-message",
        highlight: function(element) {
            $(element).addClass("error-input");
        },
        unhighlight: function(element) {
            $(element).removeClass("error-input");
        },
        submitHandler: function(form) {
            // Lấy dữ liệu từ form
            const khachHang = $("#khachhang").val().trim();
            const nhanVien = $("#nhanvien").val().trim();
            const soTien = parseFloat($("#sotien").val());

            // Thêm giao dịch mới vào bảng
            addTransactionToTable(khachHang, nhanVien, soTien);
            
            // Đóng modal và reset form
            $("#Addhoadon").hide();
            $("#themhoadon")[0].reset();
            
            alert('Đã thêm giao dịch thành công!');
        }
    });

    // Mở modal khi nhấn nút THÊM
    $(".add-button").on('click', function() {
        $("#Addhoadon").show();
        // Focus vào trường đầu tiên
        setTimeout(() => {
            $("#khachhang").focus();
        }, 100);
    });

    // Đóng modal khi nhấn nút X
    $(".close").on('click', function() {
        $("#Addhoadon").hide();
        $("#themhoadon")[0].reset();
        // Xóa các lỗi validation
        $("#themhoadon").validate().resetForm();
        $(".error-input").removeClass("error-input");
    });

    // Đóng modal khi nhấn nút Hủy
    $("#cancelAdd").on('click', function() {
        $("#Addhoadon").hide();
        $("#themhoadon")[0].reset();
        // Xóa các lỗi validation
        $("#themhoadon").validate().resetForm();
        $(".error-input").removeClass("error-input");
    });

    // Đóng modal khi click bên ngoài
    $(window).on('click', function(event) {
        if ($(event.target).is("#Addhoadon")) {
            $("#Addhoadon").hide();
            $("#themhoadon")[0].reset();
            // Xóa các lỗi validation
            $("#themhoadon").validate().resetForm();
            $(".error-input").removeClass("error-input");
        }
    });

    // Function thêm giao dịch vào bảng
    function addTransactionToTable(khachHang, nhanVien, soTien) {
        // Tạo ngày giờ hiện tại
        const now = new Date();
        const ngayMua = formatDate(now);
        
        // Format số tiền
        const soTienFormatted = formatMoney(soTien);
        
        const newRowHtml = `
            <tr style="opacity: 0; transform: translateY(-20px);">
                <td class="checkbox-cell">
                    <input type="checkbox">
                </td>
                <td>
                    <div class="actions-cell">
                        <button class="action-btn view-btn" title="Xem">👁</button>
                        <button class="action-btn edit-btn" title="Sửa">✏</button>
                        <button class="action-btn delete-btn" title="Xóa">🗑</button>
                    </div>
                </td>
                <td>${nextId}</td>
                <td>${khachHang}</td>
                <td>${nhanVien}</td>
                <td class="money">${soTienFormatted}</td>
                <td>${ngayMua}</td>
            </tr>
        `;
        
        const $newRow = $(newRowHtml);
        $("tbody").append($newRow);
        
        // Animation fade in
        setTimeout(() => {
            $newRow.css({
                'transition': 'all 0.5s ease',
                'opacity': '1',
                'transform': 'translateY(0)'
            });
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
    $("#selectAll").on('change', function() {
        const isChecked = $(this).is(':checked');
        $('tbody input[type="checkbox"]').each(function() {
            $(this).prop('checked', isChecked);
            const $row = $(this).closest('tr');
            if (isChecked) {
                $row.addClass('selected-row');
            } else {
                $row.removeClass('selected-row');
            }
        });
    });

    // Function xử lý checkbox của từng hàng (sử dụng event delegation)
    $(document).on('change', 'tbody input[type="checkbox"]', function() {
        const $row = $(this).closest('tr');
        if ($(this).is(':checked')) {
            $row.addClass('selected-row');
        } else {
            $row.removeClass('selected-row');
        }
        
        // Cập nhật trạng thái select all
        const totalCheckboxes = $('tbody input[type="checkbox"]').length;
        const checkedCheckboxes = $('tbody input[type="checkbox"]:checked').length;
        $("#selectAll").prop('checked', totalCheckboxes === checkedCheckboxes);
    });

    // Function xử lý nút "Delete Selected"
    $(".delete-selected").on('click', function() {
        const $selectedCheckboxes = $('tbody input[type="checkbox"]:checked');
        
        if ($selectedCheckboxes.length === 0) {
            alert('Vui lòng chọn ít nhất một bản ghi để xóa!');
            return;
        }
        
        if (confirm(`Bạn có chắc muốn xóa ${$selectedCheckboxes.length} bản ghi đã chọn?`)) {
            $selectedCheckboxes.each(function() {
                const $row = $(this).closest('tr');
                $row.css({
                    'transition': 'all 0.3s ease',
                    'opacity': '0',
                    'transform': 'translateX(-100%)'
                });
                
                setTimeout(() => {
                    $row.remove();
                }, 300);
            });
            
            // Reset select all checkbox
            $("#selectAll").prop('checked', false);
            
            setTimeout(() => {
                alert('Đã xóa các bản ghi đã chọn!');
            }, 350);
        }
    });

    // Function xóa từng hàng (sử dụng event delegation)
    $(document).on('click', '.delete-btn', function() {
        if (confirm('Bạn có chắc muốn xóa giao dịch này?')) {
            const $row = $(this).closest('tr');
            $row.css({
                'transition': 'all 0.3s ease',
                'opacity': '0',
                'transform': 'translateX(-100%)'
            });
            
            setTimeout(() => {
                $row.remove();
                alert('Đã xóa giao dịch!');
            }, 300);
        }
    });
});
