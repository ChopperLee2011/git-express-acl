var promise1 = Promise.resolve(3);
var promise2 = Promise.resolve(5);
var promise3 = Promise.resolve(0);
Promise.all([promise1,promise2, promise3])
    .then(values => {
        console.log(values); // [true, 3]
    });