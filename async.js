const isEven = (num)  =>  {
    return new Promise((resolve, reject) => {
        if(num % 2 === 0){
            resolve(`${num} is an even number`);
        }else{
            reject(`${num} is not an even number`)
        }
    })
}

async function testNumber (num){
    try {
        const result = await isEven(num);
        console.log(result)
    } catch (error) {
        console.log(error);
    }
}

testNumber(77);