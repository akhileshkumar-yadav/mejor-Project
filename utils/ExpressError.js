class ExpressError extends Error {
    constructor(statusCode,message){
        super();                     // 👈 message yahan pass nahi ho raha
        this.statusCode = statusCode;
        this.message = message;     // 👈 message manually assign kiya gaya
    }
}
module.exports = ExpressError;