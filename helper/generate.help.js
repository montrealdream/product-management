// generate random string
module.exports.randomString = (size) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let result = "";

    for(let index = 0 ; index < size ; index++){
        result += characters.charAt(
            Math.floor(Math.random()*characters.length)
        );
    }
    return result;
}