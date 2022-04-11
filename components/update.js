export const UpdateMoney = async (collection, user, value) => {
    let response = false;
    value = parseInt(value);
    await collection.updateOne({ "name": user }, { 
        $inc: 
            { "money": value } 
        })
    .then((result) => {
        response = true;
    })
    .catch((error) => {
        console.error(error);
        response = false;
    })
    return response;
}

export const UpdateTransactions = async (collection, user, value) => {
    let response = false;
    if (typeof(value) == Number) {
        let cost = value * -1;
        cost = parseInt(value)
        console.log(cost);
        value = parseInt(value);
        await collection.updateOne({ "name": user }, { 
            $inc: { 
                "money": cost, 
                "amount": 1, 
                "price": value
            } 
        })
        .then((result) => {
            response = true;
        })
        .catch((error) => {
            console.error(error);
            response = false;
        });
    }
    else if (typeof(value) === undefined) {
        response = true;
    }
    return response;
}