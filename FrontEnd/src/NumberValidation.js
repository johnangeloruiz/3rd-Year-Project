function Validation(values) {
    let error = {};
    const cellphone_pattern = /^09\d{9}$/;
    
    if (values.cellphone_number === "") {
        error.cellphone_number = "Number should not be empty";
    } else if (!cellphone_pattern.test(values.cellphone_number)) {
        error.cellphone_number = "Invalid cellphone number format";
    } else {
        error.cellphone_number = "";
    }
    
    return error;
}

export default Validation;
