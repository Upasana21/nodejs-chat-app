const { calculateTip, fahrenheitToCelusis, celusisToFahrenheit,add }=require('../src/math');

test('Calculate Tip ',()=>{
    const total= calculateTip(10,.3);
    expect(total).toBe(13)
})

test('Should convert 32F to 0C ',()=>{
    const temp = fahrenheitToCelusis(32)
    expect(temp).toBe(0)
})

test('Should convert 0C to 32F',()=>{
    const temp = celusisToFahrenheit(0);
    expect(temp).toBe(32);
})

//test asynchronous 
// test('asynch code test',(done)=>{
//     //using done notify jest that some asynchoronus task is happening
//    setTimeout(()=>{
//        expect(1).toBe(2);
//        done();
//    },2000)
// })

test('Should add two numbers',(done)=>{
    add(2,3).then((sum)=>{
        expect(sum).toBe(5);
        done();
    })
})

test('Should add using async/await',async ()=>{
    const sum = await add(2,3);
    expect(sum).toBe(5)
})