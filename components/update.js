export const UpdateMoney = (collection, user, value) => {
    let response = false;
    collection.updateOne({ "name": user }, { $set: { "money": value } })
    .then((result) => {
        response = true;
    })
    .catch((error) => {
        console.error(error);
        response = false;
    })
    return response;
}

export const UpdateTransaktions = (collection, user, newMoney, newAmount, newSpent) => {
    let response = false;
    collection.updateOne({ "name": user }, { 
        $set: { 
            "money": newMoney, 
            "amountBought": newAmount, 
            "priceBought": newSpent 
        } 
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