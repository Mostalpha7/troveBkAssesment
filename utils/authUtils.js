const formartPhoneNumber = (phoneNumber) => {
    let firstFormart = phoneNumber.substring(1);
    return `234${firstFormart}`;
};

module.exports = {
    formartPhoneNumber,
};