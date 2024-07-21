function isValueInArray(array, value) {
    var length = array.length;
    for (var i = 0; i < length; i++) {
        if (array[i] === value) {
            return true;
        }
    }
    return false;
}

function validateConditionalFields(obj, element) {
    var key = element.getAttribute("id");
    return obj[key] && element.value === "" ? "This field is required" : "";
}

function validateForm() {
    var valid = true;
    var formElements = document.forms["onboardingForm"].elements;
    var additionalFields = ["additionalAddressLine1", "additionalSuburb", "additionalCity", "additionalPostalCode"];
    var isChecked = document.getElementById('isDifferentPostAddress');
    var residentialStatus = document.getElementById('residentialStatus');
    var doesVisaNeeded = residentialStatus.value !== "citizen" && residentialStatus.value !== "no-right" || false;
    var medical = document.getElementById('medical');
    var doesMedicalNeeded = medical.value === 'yes';
    var conditionalData = {
        'visa':  doesVisaNeeded,
        'medicalDesc': doesMedicalNeeded,
    };
    for (var i = 0; i < formElements.length; i++) {
        var element = formElements[i];
        var errorElement = document.getElementById(element.id + "Error");
        var checkAdditional = isValueInArray(additionalFields, element.getAttribute("id")) || false;

        if(element.getAttribute("id") == 'visa' || element.getAttribute("id") == 'medicalDesc') {
            var isValidFailed = validateConditionalFields(conditionalData, element);
            if(isValidFailed) {
                errorElement.textContent = isValidFailed;
                valid = false;
            } else {
                errorElement.textContent = "";
            }
        } else if(isChecked.checked && checkAdditional && element.value === "" && element.hasAttribute("required")) {
            errorElement.textContent = "This field is required";
            valid = false;
        } else if (!checkAdditional && element.value === "" && element.hasAttribute("required")) {
            errorElement.textContent = "This field is required";
            valid = false;
        } else if(errorElement) {
            errorElement.textContent = "";
        }
    }

    if(valid) {
        /** Validate email */
        var email = document.getElementById('email');
        var emailError = document.getElementById('emailError');
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.value)) {
            emailError.textContent = "Email Id should be valid email";
            valid = false;
        } else {
            emailError.textContent = "";
        }

        /** Validate phone number */
        var phone = document.getElementById('phone');
        var phoneError = document.getElementById('phoneError');
        var phonePattern = /^\+?[0-9]{8,12}$/;
        if (!phonePattern.test(phone.value)) {
            phoneError.textContent = "Phone/Mobile No. should be valid number and should be 8 to 12 digit and can contain + only.";
            valid = false;
        } else {
            phoneError.textContent = "";
        }

        /** Validate dob */
        var dob = document.getElementById('dob');
        var dobError = document.getElementById('dobError');
        var today = new Date();
        var inputDate = new Date(dob.value);
        if (inputDate > today) {
            dobError.textContent = "Date of Birth cannot be a future date";
            valid = false;
        } else {
            dobError.textContent = "";
        }

        /** Validate tax number */
        var tax = document.getElementById('tax');
        var taxError = document.getElementById('taxError');
        var taxPattern = /^[0-9]+$/;
        if (!taxPattern.test(tax.value)) {
            taxError.textContent = "Tax No./IRD should be number.";
            valid = false;
        } else {
            taxError.textContent = "";
        }

        /** Validate bank number */
        var accountNo = document.getElementById('accountNo');
        var accountNoError = document.getElementById('accountNoError');
        var accountNoPattern = /^\+?[0-9]{15,16}$/;
        if (!accountNoPattern.test(accountNo.value)) {
            accountNoError.textContent = "Account No. should be number. It should be 15 to 16 digit.";
            valid = false;
        } else {
            accountNoError.textContent = "";
        }

        /** Validate emergency contact */
        var emergencyContact = document.getElementById('emergencyContact');
        var emergencyContactError = document.getElementById('emergencyContactError');
        var emergencyContactPattern = /^\+?[0-9]{8,12}$/;
        if (!emergencyContactPattern.test(emergencyContact.value)) {
            emergencyContactError.textContent = "Phone/Mobile No. should be valid number and should be 8 to 12 digit and can contain + only.";
            valid = false;
        } else {
            emergencyContactError.textContent = "";
        }

        /** Validate salary */
        var salary = document.getElementById('salary');
        var salaryError = document.getElementById('salaryError');
        var salaryPattern = /^[0-9]+$/;
        if (!salaryPattern.test(salary.value)) {
            salaryError.textContent = "Annual Salary should be number.";
            valid = false;
        } else {
            salaryError.textContent = "";
        }

        /** Validate supperannuation */
        var superannuationAmount = document.getElementById('superannuationAmount');
        var superannuationAmountError = document.getElementById('superannuationAmountError');
        var superannuationAmountPattern = /^[0-9]+$/;
        let amount = parseFloat(superannuationAmount.value);
        if (!superannuationAmountPattern.test(superannuationAmount.value)) {
            superannuationAmountError.textContent = "Supperannuation should be number";
            valid = false;
        } else if(amount < 1 || amount > 99) {
            superannuationAmountError.textContent = "Supperannuation should be between 1 to 99";
            valid = false;
        } else {
            superannuationAmountError.textContent = "";
        }
    }
    return valid;
}

function submitForm() {
    /** Disbale this if want to test tax and superannation */
    // if (!validateForm()) {
    //     return;
    // }
    var salary = document.getElementById('salary');
    var superannuationAmount = document.getElementById('superannuationAmount');
    var tax = calculateTax(parseFloat(salary.value));
    var superannuation = calculateSuperannuation(parseFloat(salary.value), parseFloat(superannuationAmount.value));
    
    var taxResult = document.getElementById('taxResult');
    var superannuationResult = document.getElementById('superannuationResult');
    taxResult.textContent = tax.toFixed(2);
    superannuationResult.textContent = superannuation.toFixed(2);

    var calculationsBlock = document.getElementById("calculationsBlock");
    calculationsBlock.classList.remove("hidden-block");
    
    console.log('submited');
}

function calculateTax(salary) {
    if (salary <= 18200) {
        return 0;
    } else if (salary <= 37000) {
        return (salary - 18200) * 0.19;
    } else if (salary <= 90000) {
        return 3572 + (salary - 37000) * 0.325;
    } else if (salary <= 180000) {
        return 20797 + (salary - 90000) * 0.37;
    } else {
        return 54097 + (salary - 180000) * 0.45;
    }
}

function calculateSuperannuation(salary, percentage) {
    return salary * (percentage / 100);
}

function isDifferentPostAddressCheckbox() {
    var isChecked = document.getElementById('isDifferentPostAddress');
    var hiddenElement = document.getElementById('differentAddress');
    isChecked && isChecked.checked ? hiddenElement.classList.remove('hidden-block') : hiddenElement.classList.add('hidden-block');
}

function residentialStatusChange() {
    var status = document.getElementById('residentialStatus');
    var visa = document.getElementById('visaBlock');
    status.value !== "citizen" && status.value !== "no-right" ? visa.classList.remove('hidden-block') : visa.classList.add('hidden-block');
}

function medicalCondition() {
    var condition = document.getElementById('medical');
    var medicalDescBlock = document.getElementById('medicalDescBlock');
    condition.value === "yes" ? medicalDescBlock.classList.remove('hidden-block') : medicalDescBlock.classList.add('hidden-block');
}

function testCalculateTax() {
    console.assert(calculateTax(18000) === 0, "Test Case 1 Failed");
    console.assert(calculateTax(37000) === 3572, "Test Case 2 Failed");
    console.assert(calculateTax(90000) === 20797, "Test Case 3 Failed");
    console.assert(calculateTax(180000) === 54097, "Test Case 4 Failed");
    console.assert(calculateTax(250000) === 85597, "Test Case 5 Failed");
    console.log("All calculateTax tests passed!");
}

function testCalculateSuperannuation() {
    console.assert(calculateSuperannuation(100000, 10) === 10000, "Test Case 1 Failed");
    console.assert(calculateSuperannuation(80000, 8) === 6400, "Test Case 2 Failed");
    console.assert(calculateSuperannuation(120000, 12) === 14400, "Test Case 3 Failed");
    console.log("All calculateSuperannuation tests passed!");
}

// Run tests
document.addEventListener('DOMContentLoaded', function() {
    testCalculateTax();
    testCalculateSuperannuation();
});