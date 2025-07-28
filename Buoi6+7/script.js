document.addEventListener('DOMContentLoaded', function() {
    const addEmployeeBtn = document.querySelector('.add-employee-button');
    const modal = document.getElementById('addEmployeeModal');
    const closeBtn = document.querySelector('.close');
    const cancelBtn = document.getElementById('cancelAdd');
    const addEmployeeForm = document.getElementById('addEmployeeForm');


    addEmployeeBtn.addEventListener('click', function() {
        modal.style.display = 'block';

        document.getElementById('employee_name').focus();
  
    });


    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        addEmployeeForm.reset();
    });


    cancelBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        addEmployeeForm.reset();
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            addEmployeeForm.reset();
        }
    });


    addEmployeeForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const name = document.getElementById('employee_name').value;
        const email = document.getElementById('employee_email').value;
        const address = document.getElementById('employee_address').value;
        const phone = document.getElementById('employee_phone').value;


        if (!name || !email || !address || !phone) {
            alert('May dien day du thong tin!');
            return;
        }

 
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address!');
            return;
        }

   
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(phone)) {
            alert('Phai 10 - 11 so');
            return;
        }


        addEmployeeToTable(name, email, address, phone);
        
        modal.style.display = 'none';
        addEmployeeForm.reset();
        
        alert('Dang ky thanh cong nhan vien moi!');
    });
});

function addEmployeeToTable(name, email, address, phone) {
    const tableBody = document.querySelector('.table tbody');
    const newRow = document.createElement('tr');
    
    newRow.innerHTML = `
        <td><input type="checkbox" class="checkbox"></td>
        <td>${name}</td>
        <td>${email}</td>
        <td>${address}</td>
        <td>${phone}</td>
        <td>
            <button class="edit-employee-button">Edit</button>
            <button class="delete-employee-button">Delete</button>
        </td>
    `;
    
    tableBody.appendChild(newRow);
}
