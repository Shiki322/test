let randomOrg = require('random-org');
let random = new randomOrg({apiKey:'a6cea22b-7e24-4817-b827-b5108d2ec22e'});
let number = 0;
let generate = (cb) =>
{
    random.generateIntegers({min: 1, max: 100, n: 1}).then(result => {
        let oldNumber = number;
        number = result.random.data[0];
        cb(number, oldNumber);
    });
};

module.exports = {
    getNumber() {
        return number;
    },
    normal(cb) {
        if (number === 0 || (number % 3 > 0 && number % 5 > 0)) {
            generate(cb);
            return true;
        } else {
            return false;
        }
    },
    fizz(cb) {
        if (number % 3 === 0 && number % 5 > 0) {
            generate(cb);
            return true;
        } else {

        }
    },
    buzz(cb) {
        if (number % 5 === 0 && number % 3 > 0) {
            generate(cb);
            return true;
        } else {

        }
    },
    fizzbuzz(cb) {
        if (number % 3 === 0 && number % 5 === 0) {
            generate(cb);
            return true;
        } else {
            return false;
        }
    }
};
