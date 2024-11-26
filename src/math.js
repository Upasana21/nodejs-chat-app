const calculateTip =(total,tipPercentage)=> total+(total * tipPercentage);

const fahrenheitToCelusis =(temp)=> (temp - 32) / 1.8;

const celusisToFahrenheit =(temp)=> (temp * 1.8) + 32;

const add=(a,b)=>{
    return new Promise((resolve,reject)=>{
    setTimeout(()=>{
       if(a <0 || b<0){
      return reject('Numbers must be non-negative')
         }
       resolve(a+b)
     },2000)
    }
   )}

module.exports={
    calculateTip,
    fahrenheitToCelusis,
    celusisToFahrenheit,
    add
}