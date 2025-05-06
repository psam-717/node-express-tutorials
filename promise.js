const isEven = (num)  =>  {
    return new Promise((resolve, reject) => {
        if(num % 2 === 0){
            resolve(`${num} is an even number`);
        }else{
            reject(`${num} is not an even number`)
        }
    })
}

isEven(44)
.then((success) => {
    console.log(success);
})
.catch((error) => {
    console.log(error)
})